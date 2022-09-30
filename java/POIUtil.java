package com.atjubo.saas.util;

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.poi.excel.BigExcelWriter;
import cn.hutool.poi.excel.ExcelUtil;
import com.atjubo.saas.common.util.DateUtil;
import com.atjubo.saas.common.util.ListUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.streaming.SXSSFSheet;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.util.*;

/**
 * POI工具
 */
public class POIUtil {
    /**
     * 系统临时目录
     * <br>
     * windows 包含路径分割符，但Linux 不包含,
     * 在windows \\==\ 前提下，
     * 为安全起见 同意拼装 路径分割符，
     * <pre>
     *       java.io.tmpdir
     *       windows : C:\Users/xxx\AppData\Local\Temp\
     *       linux: /temp
     * </pre>
     */
    public static final String SYS_TEM_DIR = System.getProperty("java.io.tmpdir") + File.separator;
    /**
     * 二维数组导出excel title也包含在lists里
     * @param response
     * @param lists
     * @param fileName
     * @throws IOException
     */
    public static void exportExcel(HttpServletResponse response, List<List<Object>> lists, String fileName) throws IOException {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("Sheet1");
        for(int i = 0; i < lists.size(); i++){
            HSSFRow row = sheet.createRow(i);
            for(int j = 0; j < lists.get(i).size(); j++){
                Object v = lists.get(i).get(j);

                if(v instanceof Date){
                    v = DateUtil.format((Date) v, DateUtil.FORMAT_YMD);
                }
                else if(v instanceof BigDecimal){
                    v = ((BigDecimal) v).stripTrailingZeros().toPlainString();
                }

                if(v instanceof Integer){
                    row.createCell(j).setCellValue((Integer) v);
                }
                else {
                    String val = v == null ? "" : String.valueOf(v);
                    row.createCell(j).setCellValue(val);
                }
            }
        }
        OutputStream output = response.getOutputStream();
//        response.reset();
        response.setHeader("Content-disposition", "attachment; filename=" + URLEncoder.encode(fileName, "UTF-8"));
        response.setContentType("application/msexcel");
        wb.write(output);
        output.close();
        wb.close();

    }

    /**
     * map数组导出excel，标题是第一个map的keys
     * @param response
     * @param mapList
     * @param fileName
     * @throws IOException
     */
    public static void exportExcelByLinkedMaps(HttpServletResponse response, List<LinkedHashMap<String, Object>> mapList, String fileName) throws IOException {
        List<List<Object>> lists = new ArrayList<>();
        if(mapList != null && mapList.size() > 0){
            List<Object> titles = new ArrayList<>(mapList.get(0).keySet());
            lists.add(titles);
            for(LinkedHashMap<String, Object> v : mapList){
                List<Object> list = new ArrayList<>();
                for(Object k : titles){
                    list.add(v.get(k));
                }
                lists.add(list);
            }
        }

        exportExcel(response, lists, fileName);
    }

    /**
     * 导出excel
     */
    public static void downloadExcel(List<Map<String, Object>> list, HttpServletResponse response) throws IOException {
        String tempPath = SYS_TEM_DIR + IdUtil.fastSimpleUUID() + ".xlsx";
        File file = new File(tempPath);
        BigExcelWriter writer = ExcelUtil.getBigWriter(file);
        // 一次性写出内容，使用默认样式，强制输出标题
        writer.write(list, true);
        SXSSFSheet sheet = (SXSSFSheet)writer.getSheet();
        //上面需要强转SXSSFSheet  不然没有trackAllColumnsForAutoSizing方法
        sheet.trackAllColumnsForAutoSizing();
        //列宽自适应
        writer.autoSizeColumnAll();
        //response为HttpServletResponse对象
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8");
        //test.xls是弹出下载对话框的文件名，不能为中文，中文请自行编码
        response.setHeader("Content-Disposition", "attachment;filename=file.xlsx");
        ServletOutputStream out = response.getOutputStream();
        // 终止后删除临时文件
        file.deleteOnExit();
        writer.flush(out, true);
        //此处记得关闭输出Servlet流
        IoUtil.close(out);
    }
}
