package com.atjubo.saas.util;

import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.Map;

public class FreemarkerUtil {
    @Autowired
    private Configuration configuration;

    private final String UTF_8 = "UTF-8";

    /**
     * excel、word等模板导出（其他的可以试试如pdf）
     * @param response
     * @param data
     * @param templateName
     * @param fileName
     * @throws Exception
     */
    public void export(HttpServletResponse response, Map<?, ?> data, String templateName,  String fileName) throws Exception {
        //构造输出流
        Template template = this.configuration.getTemplate(templateName, UTF_8);
        //数字被自动转化问题解决文章上是#|0，测了这个也行
        template.setNumberFormat("");
        File file = new File(fileName);
//        FileWriter out = new FileWriter(fileName);
        Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(fileName), UTF_8));
        //模板数据渲染
        template.process(data, out);
        //将文件输出到response,返回给客户端
        FileInputStream in = new FileInputStream(file);
        byte[] buffer = new byte[in.available()];
        in.read(buffer);
        //会清除请求头先注释
//        response.reset();
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8");
        response.setHeader("content-disposition", "attachment;filename=" + URLEncoder.encode(fileName, UTF_8));
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(buffer);

        outputStream.flush();
        outputStream.close();
        in.close();
        out.flush();
        out.close();

        //删除文件
        file.delete();
    }
}
