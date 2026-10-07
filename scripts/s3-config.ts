// Import required AWS SDK clients and commands for Node.js
import { GetBucketCorsCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/storage/s3";

const cors = {
  Bucket: "social-app",
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"], // Added HEAD & DELETE
        AllowedOrigins: ["http://localhost:3000", "http//192.168.1.105:300"],
        MaxAgeSeconds: 3000,
      },
    ],
  },
};

const run = async () => {
  try {
    // const response = await s3Client.send(new PutBucketCorsCommand(cors));
    // console.log("Success", response);

    const result = await s3Client.send(
      new GetBucketCorsCommand({
        Bucket: "social-app",
      }),
    );

    console.dir(result.CORSRules, { depth: null });
  } catch (err) {
    console.log("Error", err);
  }
};

run();
