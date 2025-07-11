import os
from flask import Flask, request, jsonify
from waitress import serve
from pydicom import dcmread
from pynetdicom import AE, StoragePresentationContexts
import mysql.connector
#from push_impl import send_dicom_files
import pydicom
from pynetdicom import AE, StoragePresentationContexts
from pynetdicom.sop_class import CTImageStorage, MRImageStorage, SecondaryCaptureImageStorage, DigitalXRayImageStorageForPresentation
import io
import gdcm
import tempfile
from pydicom.uid import JPEGLosslessSV1, ExplicitVRLittleEndian
import logging
import pymysql
from pymysql import Error
from datetime import timedelta

# Flask app setup
app = Flask(__name__)

# DICOM server configuration
#SERVER_IP = "192.152.80.24"  # Replace with the receiving server's IP
#SERVER_PORT = 8890            # Replace with the receiving server's port
#AE_TITLE = "PACS_FYZKS"   # Replace with the receiving server's AE title



# ------ copied start ********************

transfer_syntax = JPEGLosslessSV1

SERVER_IP = "192.152.80.24"
SERVER_PORT = 8890
AE_TITLE = "PACS_FYZKS"

DICOM_FOLDER = r"D:/PACS Dev/pacs-backend/data2/"

def check_metadata_consistency(folder_path):
    study_uids = set()
    for root, _, files in os.walk(folder_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            try:
                dataset = dcmread(file_path)
                study_uids.add(dataset.StudyInstanceUID)
            except Exception as e:
                print(f"Error reading DICOM file {file_name}: {e}")

    if len(study_uids) > 1:
        print(f"Warning: Multiple Study Instance UIDs detected: {study_uids}")
        return False, None
    elif len(study_uids) == 1:
        return True, study_uids.pop()
    else:
        print("No valid DICOM files found.")
        return False, None


def convert_to_explicit_le(ds):
    try:
        # Decompress first if compressed
        if ds.file_meta.TransferSyntaxUID.is_compressed:
            ds.decompress()
        
        # Convert to Explicit VR Little Endian
        ds.file_meta.TransferSyntaxUID = ExplicitVRLittleEndian
        
        # Ensure pixel data is compatible
        pixel_array = ds.pixel_array
        ds.PixelData = pixel_array.tobytes()
        
        return ds
    except Exception as e:
        print(f"Error converting dataset: {str(e)}")
        return None

def send_dicom_files(folder_path, server_ip, server_port, ae_title):
    # Initialize the Application Entity
    ae = AE(ae_title="OLD_PACS_AE")
    source_port = 11112

    for context in StoragePresentationContexts:
        ae.add_requested_context(context.abstract_syntax, transfer_syntax)

    # Establish association with the server
    assoc = ae.associate(server_ip, server_port,StoragePresentationContexts, ae_title=ae_title )
    
    if assoc.is_established:
        print("Association established with the server")
        # Traverse the directory recursively
        for root, _, files in os.walk(folder_path):
            for file_name in files:
                file_path = os.path.join(root, file_name)
                try:
                    # Skip non-DICOM files if needed
                    if not file_name.lower().endswith(".dcm") and False:
                        print(f"Skipping non-DICOM file: {file_name}")
                        continue

                    # Read and send the DICOM file
                    dataset = dcmread(file_path)
                    # print(dataset)
                    output_file = 'temp.dcm'
                    # newDataset = convert_jpeg_lossless_to_explicit_vr_little_endian(file_path, output_file)
                    newDataset = convert_to_explicit_le(dataset)

                    # CUSTOM_TAGS -- START ------
                    private_creator_tag = (0x0019, 0x0010)  # Example group for private tags
                    newDataset.add_new(private_creator_tag, 'LO', 'SANDEEP')  # Set the private creator name

                    # Add a custom tag within the private block
                    custom_tag = (0x0019, 0x1001)  # Private tag defined by the creator
                    newDataset.add_new(custom_tag, 'LO', 'FROM_LEGACY_PACS')  # 'LO' = Long String
                    # ---- END ----

                    status = assoc.send_c_store(newDataset)

                    if status:
                        print(f"Sent: {file_path} (Status: {status.Status})")
                    else:
                        print(f"Failed to send: {file_path}")

                except Exception as e:
                    print(f"Error reading or sending {file_path}: {e}")


        # Release the association
        assoc.release()
        print("Association released")
    else:
        print("Failed to establish association with the server")



## COPIED ___END ----****************



# MySQL database configuration
DB_CONFIG = {
    'host': '192.168.200.105',       
    'user': 'root',            
    'password': 'INSTA12195441',    
    'database': 'radspeed',
}

def get_dicom_file_paths(patient_id, exlude_db_ids, exclude_combinations1, acc_nos):
    exclude_combinations = [
       ('1001', 'A123'),
       ('1002', 'A124'),
       ('1003', 'A125')
    ]
    print("exclude", acc_nos)

    if not acc_nos:
       acc_nos = ['']

    if not exlude_db_ids:
       exlude_db_ids = ['']

    try:
        print("inside get dicom file paths", patient_id)
        connection = pymysql.connect(
          host='localhost',
          user='root',
          password='INSTA12195441',
          database='radspeed'
        )

        print("3")
        cursor = connection.cursor()
        print("4")

        """ SELECT * FROM radspeed.t_study """
        """ folder_location accessionNo studyDesc studyDate studyTime patient_dbId center_id orderNumber HIS_Status """
        print("2")
        cursor.execute("select dBId from radspeed.t_patient where patientId= %s and dBId NOT IN %s", (patient_id, exlude_db_ids))
        print("1")
        patients = cursor.fetchall()
        print("patients", patients)
        patient_ids = tuple([row[0] for row in patients])
        
        if not patients:
            return

        query = """
            SELECT 
                t_study.folder_location, 
                t_study.instanceUID, 
                t_study.accessionNo, 
                t_study.studyDesc, 
                t_study.studyDate, 
                t_study.studyTime, 
                t_study.patient_dbId, 
                t_study.center_id, 
                t_study.orderNumber, 
                t_study.HIS_Status
            FROM 
                radspeed.t_study AS t_study
            INNER JOIN 
               radspeed.t_study_additional_info AS t_study_additional
            ON 
               t_study.instanceUID = t_study_additional.studyInstanceUID
            WHERE 
               t_study.patient_dbId IN %s
               AND t_study_additional.modality IN ('DX', 'CT', 'MRI')
               AND t_study.accessionNo NOT IN %s
        """
        params = (tuple(patient[0] for patient in patients), tuple(acc_nos))
        #cursor.execute(query, (patient_ids), acc_nos)
        cursor.execute(query, params)

        results = cursor.fetchall()
        print("dicom location", results)
        file_paths = [os.path.join(row[0], row[1]) for row in results] 
        study_ids = tuple([row[1] for row in results])
        acc_nos = tuple([row[2] for row in results])
        ord_nos = tuple([row[8] for row in results])

        columns = [desc[0] for desc in cursor.description]  # Get column names
        studies = [dict(zip(columns, row)) for row in results]

        for row in studies:
            for key, value in row.items():
                if isinstance(value, timedelta):
                    # Convert timedelta to total seconds (or you can use str(value))
                    row[key] = str(value)  # or row[key] = value.total_seconds()

        return file_paths, patient_ids, acc_nos, studies

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return []

    finally:
        print("inside finally")
        if 'connection' in locals() and connection.open:
           connection.close()
           print("Connection closed")

def get_dicom_files(folder_path, instance_uid):
    dicom_files = []
    full_path = os.path.join(folder_path, instance_uid)

    for root, _, files in os.walk(full_path):
        for file in files:
            if file.lower().endswith(".dcm"):
                dicom_files.append(os.path.join(root, file))

    return dicom_files

@app.route('/push_studies', methods=['POST'])
def push_studies():
    
    data = request.get_json()
    if not data or 'patient_id' not in data:
        return jsonify({"error": "Missing 'patient_id' in request"}), 400

    patient_id = data['patient_id']
    exlude_db_ids = data['exlude_db_ids']
    exclude_combinations = data['exclude_combinations']
    acc_nos = data['acc_nos']

    print(f"Received request to push studies for PatientID: {patient_id}")

    # Fetch folder paths and instance UIDs from the database
    dicom_files_result = get_dicom_file_paths(patient_id, exlude_db_ids, exclude_combinations, acc_nos)
    if not dicom_files_result:
        return jsonify({"error": "No DICOM folders found for the given PatientID"}), 404

    folder_info, patient_ids, acc_nos, studies = dicom_files_result
    #print("folders", folder_info)
    if not folder_info:
        return jsonify({"error": "No DICOM folders found for the given PatientID"}), 404

    for dcm in folder_info:
        print("dcm", dcm)
        send_dicom_files(dcm, SERVER_IP, SERVER_PORT, AE_TITLE)
    
    return jsonify({"message": f"Pushed: {patient_id}", "db_ids": patient_ids, "studies": studies, "acc_nos": acc_nos}), 200

if __name__ == "__main__":
    #app.run(host="0.0.0.0", port=6500, debug=True)
    logging.basicConfig(level=logging.ERROR)
    # app.logger.setLevel(logging.DEBUG)

    serve(app, host='0.0.0.0', port=6543)
