package com.atjubo.saas.common.util;

import com.atjubo.saas.common.exception.ApiException;
import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import io.minio.messages.Bucket;
import io.minio.messages.Item;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;


@Component
@Slf4j
public class MinioUtil {

    @Autowired
    private MinioClient minioClient;

    private static final int DEFAULT_EXPIRY_TIME = 7 * 24 * 3600;

    /**
     * 检查存储桶是否存在
     *
     * @param bucketName 存储桶名称
     * @return
     */
    @SneakyThrows
    public boolean bucketExists(String bucketName) {
        return minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
    }

    /**
     * 创建存储桶
     *
     * @param bucketName 存储桶名称
     */
    @SneakyThrows
    public boolean makeBucket(String bucketName) {
        boolean flag = bucketExists(bucketName);
        if (!flag) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            return true;
        } else {
            return false;
        }
    }

    /**
     * 列出所有存储桶名称
     *
     * @return
     */
    @SneakyThrows
    public List<String> listBucketNames() {
        List<Bucket> bucketList = listBuckets();
        List<String> bucketListName = new ArrayList<>();
        for (Bucket bucket : bucketList) {
            bucketListName.add(bucket.name());
        }
        return bucketListName;
    }

    /**
     * 列出所有存储桶
     *
     * @return
     */
    @SneakyThrows
    public List<Bucket> listBuckets() {
        return minioClient.listBuckets();
    }

    /**
     * 删除存储桶
     *
     * @param bucketName 存储桶名称
     * @return
     */
    @SneakyThrows
    public boolean removeBucket(String bucketName) {
        boolean flag = bucketExists(bucketName);
        if (flag) {
            Iterable<Result<Item>> myObjects = listObjects(bucketName);
            for (Result<Item> result : myObjects) {
                Item item = result.get();
                // 有对象文件，则删除失败
                if (item.size() > 0) {
                    return false;
                }
            }
            // 删除存储桶，注意，只有存储桶为空时才能删除成功。
            minioClient.removeBucket(RemoveBucketArgs.builder().bucket(bucketName).build());
            flag = bucketExists(bucketName);
            if (!flag) {
                return true;
            }

        }
        return false;
    }

    /**
     * 列出存储桶中的所有对象名称
     *
     * @param bucketName 存储桶名称
     * @return
     */
    @SneakyThrows
    public List<String> listObjectNames(String bucketName) {
        List<String> listObjectNames = new ArrayList<>();
        boolean flag = bucketExists(bucketName);
        if (flag) {
            Iterable<Result<Item>> myObjects = listObjects(bucketName);
            for (Result<Item> result : myObjects) {
                Item item = result.get();
                listObjectNames.add(item.objectName());
            }
        }
        return listObjectNames;
    }

    /**
     * 列出存储桶中的所有对象
     *
     * @param bucketName 存储桶名称
     * @return
     */
    @SneakyThrows
    public Iterable<Result<Item>> listObjects(String bucketName) {
        boolean flag = bucketExists(bucketName);
        if (flag) {
            return minioClient.listObjects(ListObjectsArgs.builder().bucket(bucketName).build());
        }
        return null;
    }




    /**
     * 文件上传
     *
     * @param bucketName
     * @param multipartFile
     */
    @SneakyThrows
    public void putObject(String bucketName, MultipartFile multipartFile, String objectName) {
//        PutObjectOptions putObjectOptions = new PutObjectOptions(multipartFile.getSize(), PutObjectOptions.MIN_MULTIPART_SIZE);
//        putObjectOptions.setContentType(multipartFile.getContentType());
//        minioClient.putObject(bucketName, filename, multipartFile.getInputStream(), putObjectOptions);

        this.minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .stream(multipartFile.getInputStream(), multipartFile.getSize(), -1)
                        .contentType(multipartFile.getContentType())
                        .build()
        );
    }



    /**
     * 生成一个给HTTP GET请求用的presigned URL。
     * 浏览器/移动端的客户端可以用这个URL进行下载，即使其所在的存储桶是私有的。这个presigned URL可以设置一个失效时间，默认值是7天。
     *
     * @param bucketName 存储桶名称
     * @param objectName 存储桶里的对象名称
     * @param expires    失效时间（以秒为单位），默认是7天，不得大于七天
     * @return
     */

    public String getPresignedObjectUrl(String bucketName, String objectName) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        Map<String, String> reqParams = new HashMap<String, String>();
        reqParams.put("response-content-type", "application/json");
        String url = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(bucketName)
                        .object(objectName)
                        .expiry(this.DEFAULT_EXPIRY_TIME)
//                        .extraQueryParams(reqParams)
                        .build()
        );

        return url;
    }



    public void downloadFile(String bucketName, String fileName, String originalName, HttpServletResponse response) {
        try {

//            InputStream file = minioClient.getObject(bucketName, fileName);
            InputStream file = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
            String filename = new String(fileName.getBytes("ISO8859-1"), StandardCharsets.UTF_8);
            if (StringUtils.isNotEmpty(originalName)) {
                fileName = originalName;
            }
            response.setHeader("Content-Disposition", "attachment;filename=" + filename);
            ServletOutputStream servletOutputStream = response.getOutputStream();
            int len;
            byte[] buffer = new byte[1024];
            while ((len = file.read(buffer)) > 0) {
                servletOutputStream.write(buffer, 0, len);
            }
            servletOutputStream.flush();
            file.close();
            servletOutputStream.close();
        } catch (ErrorResponseException e) {
            log.info("ErrorResponseException:{}",e.getMessage());
//            e.printStackTrace();
        } catch (Exception e) {
            log.info("Exception:{}",e.getMessage());
//            e.printStackTrace();
        }
    }

    /**
     * 获取文件
     * @param bucketName
     * @param fileName
     * @return
     */
    public InputStream getFile(String bucketName, String fileName){
        try {
            return minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .build()
            );
        }
        catch (Exception e){
            log.info("minio:{}",e.getMessage());
        }
        return null;
    }

    /**
     * 本地文件上传
     * @param bucketName 桶名
     * @param objectName 对象名
     * @param fileName 文件路径
     * @throws IOException
     * @throws ServerException
     * @throws InsufficientDataException
     * @throws ErrorResponseException
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeyException
     * @throws InvalidResponseException
     * @throws XmlParserException
     * @throws InternalException
     */
    public void upload(String bucketName, String objectName, String fileName) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        this.minioClient.uploadObject(
                UploadObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .filename(fileName)
                        .build()
        );
    }

    /**
     * 根据相对地址删除文件
     *
     * @param bucketName
     * @param fileName
     * @return
     */
    public String delete(String bucketName,String fileName){
        try {
            this.minioClient.removeObject(RemoveObjectArgs.builder().bucket(bucketName).object(fileName).build());
        }catch (Exception e){
            log.info("deleteByName:{}",e.getMessage());
            return "删除失败";
        }
        return "删除成功";

    }

    public void writeAndUpload(String bucketName, String fileName, String content) {
        String defaultBaseDir = System.getProperty("java.io.tmpdir");
        String fileUrl = defaultBaseDir + fileName;
        File file = new File(fileUrl);
        try {
            boolean createdFlag = file.createNewFile();
            FileWriter fw = new FileWriter(fileUrl);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(content);
            bw.flush();
            bw.close();
            fw.close();

            this.upload(bucketName, fileName, fileUrl);
            file.delete();
        } catch (IOException e) {
            e.printStackTrace();
            throw new ApiException("文件创建失败");
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApiException("文件上传失败");
        }
    }

    /**
     * 批量上传文件
     * @param bucketName
     * @param objects
     * @return
     * @example objects
     * List<SnowballObject> = new ArrayList<>();
     * objects.add(
     *      new SnowballObject (
     *                     "my-object-one",
     *                     new ByteArrayInputStream("hello".getBytes(StandardCharsets.UTF_8)),
     *                     5,
     *                     null));
     *     objects.add(
     *             new SnowballObject(
     *                     "my-object-two",
     *                     new ByteArrayInputStream("java".getBytes(StandardCharsets.UTF_8)),
     *                     4,
     *                     null));
     */
    public Boolean uploadObjects(String bucketName, List<SnowballObject> objects){
        try {
            ByteArrayInputStream bt;

            minioClient.uploadSnowballObjects(
                    UploadSnowballObjectsArgs.builder().bucket(bucketName).objects(objects).build());
        } catch (Exception e) {
            log.error("批量上传文件到minio错误:", e);
            return false;
        }
        return true;
    }


}