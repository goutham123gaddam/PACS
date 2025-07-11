const config = {
    
    source: {
      aet: "PACS_FYZKS",
      ip: "192.152.80.24",
      port: "8890"
    },
    peers: [
      	
	{
        aet: "ALLENGERSDR",
        ip: "192.168.1.146",
        port: 104
      	},
      {
        aet: "RADPUSH",
        ip: "192.168.200.105",
        port: 104
	    }, 
	
// 	{
//         aet: "EMERGENCYHS60",
//         ip: "127.0.0.1",
//         port: 1005
// 	}, 
 	{
         aet: "AN_PETCT153547",
         ip: "192.168.1.112",
         port: 104
 	}, 
 	{
 	aet: "adw",
 	ip: "192.168.1.228",
 	port: 4006
 	},
 {
 	aet: "ALLENGERSDR1",
 	ip: "192.168.191.40",
 	port: 104
 	},
 {
 	aet: "CT120535",
 	ip: "192.168.1.10",
 	port: 104
 	},

	/*{
	aet: "RADSERVER1",
	ip: "192.168.200.57",
	port: 104
	}*/
],
      
    
    /*
    Supported Transfer Syntaxes:
    1.2.840.10008.1.2       Implicit VR Endian: Default Transfer Syntax for DICOM    
    1.2.840.10008.1.2.1     Explicit VR Little Endian    
    1.2.840.10008.1.2.2     Explicit VR Big Endian   
    1.2.840.10008.1.2.4.50  JPEG Baseline (Process 1) - Lossy JPEG 8-bit Image Compression
    1.2.840.10008.1.2.4.51  JPEG Baseline (Processes 2 & 4) - Lossy JPEG 12-bit Image Compression
    1.2.840.10008.1.2.4.70  JPEG Lossless, Nonhierarchical, First- Order Prediction
    1.2.840.10008.1.2.4.80  JPEG-LS Lossless Image Compression   <-- recommended
    1.2.840.10008.1.2.4.81  JPEG-LS Lossy (Near- Lossless) Image Compression
    1.2.840.10008.1.2.4.90  JPEG 2000 Image Compression (Lossless Only)	 
    1.2.840.10008.1.2.4.91  JPEG 2000 Image Compression
    1.2.840.10008.1.2.5     RLE Lossless
    */

    // transfer syntax (e.g. compression of dicom files) used for transmission via wado and proposed to pacs
    // transferSyntax: '1.2.840.10008.1.2.4.90', // attention: compression not yet working with wado-rs (worked with CT SCAN)
    // transferSyntax: '1.2.840.10008.1.2.4.50',  // worked for ultrasound
    transferSyntax: '1.2.840.10008.1.2.5',
    logDir: "./logs",
    storagePath: "./data2",
    webserverPort: 4000,
    qidoMinChars: 0, // do not issue c-find if search contains less characters
    qidoAppendWildcard: true, // auto append * for patient name query
    permissiveMode: true, // when set to false, all AETs able to query and push need to be in peers
    verboseLogging: false, // enable verbose logging to std::out (contains DIMSE output)
};

module.exports = config;
