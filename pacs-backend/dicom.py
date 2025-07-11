import json
import pydicom
import sys
import os


def get_first_file_name(directory):
    """Get the first file name from the directory."""
    files = os.listdir(directory)
    if files:
        return os.path.join(directory, files[0])
    else:
        return None


def json_serializable(value):
    """
    Convert DICOM attribute values to JSON-serializable types.
    Handles MultiValue and other non-serializable types.
    """
    if isinstance(value, pydicom.multival.MultiValue):
        return list(value)
    if isinstance(value, bytes):
        return value.decode('utf-8', 'ignore')  # Decode bytes to string if possible
    if isinstance(value, (str, int, float, list, dict)):
        return value
    return str(value)  # Fallback: convert to string


def getDicomMetadata(studyPath):
    """Extract DICOM metadata."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    #data_folder_path = os.path.join(script_dir, 'data2', studyPath) # for local or same data folder
    data_folder_path = os.path.abspath(studyPath) # for external folder

    first_file = get_first_file_name(data_folder_path)

    if first_file:
        try:
            # Load the DICOM file
            dicom_dataset = pydicom.dcmread(first_file)

            # Collect all metadata
            metadata = {
                "PatientName": json_serializable(getattr(dicom_dataset, 'PatientName', None)),
                "PatientID": json_serializable(getattr(dicom_dataset, 'PatientID', None)),
                "StudyDate": json_serializable(getattr(dicom_dataset, 'StudyDate', None)),
                "Modality": json_serializable(getattr(dicom_dataset, 'Modality', None)),
                "ImageType": json_serializable(getattr(dicom_dataset, 'ImageType', None)),
                "InstitutionName": json_serializable(getattr(dicom_dataset, 'InstitutionName', None)),
                "InstitutionAddress": json_serializable(getattr(dicom_dataset, 'InstitutionAddress', None)),
                "InstitutionalCodeSequence": json_serializable(dicom_dataset.get((0x0008, 0x0082), None)),
                "InstitutionalDepartmentName": json_serializable(getattr(dicom_dataset, 'InstitutionalDepartmentName', None)),
                "SiteName": json_serializable(dicom_dataset.get((0x0012, 0x0031), None)),
                "BodyPartExamined": json_serializable(getattr(dicom_dataset, "BodyPartExamined", None)),
                "AdditionalMetadataTags": {},
                "TOTAL_INSTANCES": json_serializable(getattr(dicom_dataset, "NumberOfStudyRelatedInstances", None))
            }

            # Skip specific tags
            tags_to_skip = {"SequenceOfUltrasoundRegions", "PixelData", "ReferencedPerformedProcedureStepSequence", "ProcedureCodeSequence", "DerivationCodeSequence", "RequestAttributesSequence"}

            # Add all other tags
            for tag in dicom_dataset.keys():
                try:
                    element = dicom_dataset[tag]
                    tag_name = pydicom.datadict.keyword_for_tag(tag)

                    # Skip tags specified in `tags_to_skip`
                    if tag_name in tags_to_skip:
                        continue

                    metadata["AdditionalMetadataTags"][tag_name or str(tag)] = json_serializable(element.value)
                except Exception as e:
                    metadata["AdditionalMetadataTags"][str(tag)] = f"Error extracting tag: {str(e)}"

            # Return metadata as JSON
            return json.dumps(metadata, indent=4)
        except Exception as e:
            return json.dumps({"error": f"Failed to read DICOM file: {str(e)}"}, indent=4)
    else:
        return json.dumps({"error": "No files found in the directory."}, indent=4)


def main():
    """Main function."""
    if len(sys.argv) > 1:
        studyPath = sys.argv[1]
        metadata = getDicomMetadata(studyPath)
        print(metadata)
    else:
        print("No study path provided.")


if __name__ == "__main__":
    main()
