package com.teamops.storage;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MinioStorageService {

  private static final Logger log = LoggerFactory.getLogger(MinioStorageService.class);

  private final MinioClient minioClient;
  private final MinioProperties properties;

  public MinioStorageService(MinioClient minioClient, MinioProperties properties) {
    this.minioClient = minioClient;
    this.properties = properties;
  }

  /**
   * Uploads an object to MinIO.
   *
   * @param objectKey unique key under which the object is stored
   * @param inputStream file data
   * @param contentType MIME type
   * @param size file size in bytes
   */
  public void upload(String objectKey, InputStream inputStream, String contentType, long size) {
    try {
      minioClient.putObject(
          PutObjectArgs.builder().bucket(properties.getBucket()).object(objectKey).stream(
                  inputStream, size, -1)
              .contentType(contentType)
              .build());
      log.debug("Uploaded object '{}' to bucket '{}'", objectKey, properties.getBucket());
    } catch (Exception e) {
      throw new StorageException("Failed to upload file to MinIO: " + objectKey, e);
    }
  }

  /**
   * Generates a presigned GET URL for the given object key.
   *
   * @param objectKey the stored object key
   * @return a time-limited presigned URL string
   */
  public String generatePresignedDownloadUrl(String objectKey) {
    try {
      return minioClient.getPresignedObjectUrl(
          GetPresignedObjectUrlArgs.builder()
              .method(Method.GET)
              .bucket(properties.getBucket())
              .object(objectKey)
              .expiry(properties.getPresignedUrlExpiryMinutes(), TimeUnit.MINUTES)
              .build());
    } catch (Exception e) {
      throw new StorageException("Failed to generate presigned URL for: " + objectKey, e);
    }
  }
}
