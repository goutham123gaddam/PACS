import pydicom
import sys
import os

def getDicomMetadata(studyPath):
  # Load DICOM file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_file_path = os.path.join(script_dir, '..', 'data', studyPath)
    # dicom_file_path = "1.3.12.2.1107.5.1.7.120535.30000024010910392707300000677"
    dicom_dataset = pydicom.dcmread(data_file_path)

    # Print basic DICOM header information
    print("DICOM Header Information:")
    print("Patient Name:", dicom_dataset.PatientName)
    print("Patient ID:", dicom_dataset.PatientID)
    print("Study Date:", dicom_dataset.StudyDate)
    # print("Study Description:", dicom_dataset.StudyDescription)
    print("Modality:", dicom_dataset.Modality)
    # print("Body Part Examined:", dicom_dataset.BodyPartExamined)
    print("Image Type:", dicom_dataset.ImageType)

    if 'BodyPartExamined' in dicom_dataset:
        body_part = dicom_dataset.BodyPartExamined
        print("Body Part Examined:", body_part)
    else:
        print("Body Part Examined tag not found in DICOM file.")
        
    # Print more metadata tags
    print("\nAdditional Metadata Tags:")
    for tag in dicom_dataset.keys():
        try:
            tag_name = pydicom.datadict.tag_for_keyword(tag).name
        except AttributeError:
            tag_name = tag
        print(tag_name)


def main():
    if len(sys.argv) > 1:
        studyPath = sys.argv[1]
        getDicomMetadata(studyPath)
    else:
        print("No study path provided.")
        

if __name__ == "__main__":
    main()