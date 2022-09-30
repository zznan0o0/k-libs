package com.atjubo.saas.common.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

import org.springframework.beans.BeanUtils;

import com.atjubo.saas.common.service.BeanUtilsCallBack;
import com.atjubo.saas.common.service.List2MapGetKeyFn;

/**
 * 自定义的一些list函数
 * @author zzn
 */
public class ListUtil {
    /**
     * 初始化list长度
     * @param list
     * @param size
     * @param target
     * @param <T>
     * @return
     */
    static public <T> List<T> initSize(List<T> list, int size, Supplier<T> target){
        for(int i = 0; i < size; i++){
            list.add(target.get());
        }

        return list;
    }

    /**
     * 获取list当前之后的所有序号
     * @param list
     * @param currentIndex
     * @param <T>
     * @return
     */
    static public <T> List<Integer> getNextAllSeq(List<T> list, Integer currentIndex){
        List<Integer> seqList = new ArrayList<>();
        for(Integer i = currentIndex + 1; i < list.size(); i++){
            seqList.add(i);
        }
        return seqList;
    }

    /**
     * 批量bean copy
     * @param sources
     * @param target
     * @param <S>
     * @param <T>
     * @return
     */
    public static <S, T> List<T> copyListProperties(List<S> sources, Supplier<T> target) {
        return copyListProperties(sources, target, null);
    }

    /**
     * 批量bean copy
     * @param sources
     * @param target
     * @param <S>
     * @param <T>
     * @return
     */
    public static <S, T> List<T> copyListProperties(List<S> sources, Supplier<T> target, BeanUtilsCallBack<S, T> callBack) {
        List<T> list = new ArrayList<>(sources.size());
        for (S source : sources) {
            T t = target.get();
            BeanUtils.copyProperties(source, t);
            if (callBack != null) {
                // 回调
                callBack.callBack(source, t);
            }
            list.add(t);
        }
        return list;
    }

    /**
     * list转map
     * @param vList
     * @param list2MapGetKeyFn 获取key的函数
     * @param <K>
     * @param <V>
     * @return
     */
    public static <K, V> Map<K, List<V>> list2ListMap(List<V> vList, List2MapGetKeyFn<K, V> list2MapGetKeyFn){
        Map<K, List<V>> map = new HashMap<>();
        for(V v : vList){
            K k = list2MapGetKeyFn.getKey(v);
            List<V> list = new ArrayList<>();
            if(map.get(k) != null){
                list = map.get(k);
            }
            list.add(v);
            map.put(k, list);
        }
        return map;
    }

    /**
     * list转map
     * @param vList
     * @param list2MapGetKeyFn
     * @param <K>
     * @param <V>
     * @return
     */
    public static <K, V> Map<K, V> list2Map(List<V> vList, List2MapGetKeyFn<K, V> list2MapGetKeyFn){
        Map<K, V> map = new HashMap<>();
        for(V v : vList){
            map.put(list2MapGetKeyFn.getKey(v), v);
        }
        return map;
    }

    /**
     * list转map，可以自定义val
     * @param list
     * @param kFn
     * @param vFn
     * @param <T>
     * @param <K>
     * @param <V>
     * @return
     */
    public static <T, K, V> Map<K, V> list2Map(List<T> list, Function<T, K> kFn, Function<T, V> vFn){
        Map<K, V> map = new HashMap<>();
        for(T t : list){
            map.put(kFn.apply(t), vFn.apply(t));
        }
        return map;
    }



    /**
     * Alist与Blist对应值操作,类似连表（A为主，B要是k值重的话可能会有问题）(已经更改名称eachA2BByKey)
     * @param t1List
     * @param t2List
     * @param getT1Key A取key的方法
     * @param getT2Key B取key的方法
     * @param callBack 回调好函数传参(A,B)自己实现对应逻辑
     * @param <T1> A类型
     * @param <T2> B类型
     * @param <K> 链接俩list的对应值如id
     * @return
     */
    @Deprecated
    public static <T1, T2, K> List<T1> copyA2BListByKey(List<T1> t1List, List<T2> t2List, List2MapGetKeyFn<K, T1> getT1Key, List2MapGetKeyFn<K, T2> getT2Key, BeanUtilsCallBack<T1, T2> callBack){
        Map<K, T2> t2Map = list2Map(t2List, getT2Key);

        for(T1 t1 : t1List){
            K k = getT1Key.getKey(t1);
            T2 t2 = t2Map.get(k);
            if(t2 != null){
                callBack.callBack(t1, t2);
            }
        }

        return t1List;
    }


    public static <T1, T2, K> List<T1> eachA2BByKey(List<T1> t1List, List<T2> t2List, List2MapGetKeyFn<K, T1> getT1Key, List2MapGetKeyFn<K, T2> getT2Key, BeanUtilsCallBack<T1, T2> callBack){
        return eachA2BByKey(t1List, t2List, getT1Key, getT2Key, callBack, null);
    }
    /**
     * Alist与Blist对应值操作,类似连表（A为主，B要是k值重的话可能会有问题）
     * @param t1List
     * @param t2List
     * @param getT1Key A取key的方法
     * @param getT2Key B取key的方法
     * @param callBack 回调好函数传参(A,B)自己实现对应逻辑
     * @param <T1> A类型
     * @param <T2> B类型
     * @param <K> 链接俩list的对应值如id
     * @return
     */
    public static <T1, T2, K> List<T1> eachA2BByKey(List<T1> t1List, List<T2> t2List, List2MapGetKeyFn<K, T1> getT1Key, List2MapGetKeyFn<K, T2> getT2Key, BeanUtilsCallBack<T1, T2> callBack, Consumer<T1> execNull){
        Map<K, T2> t2Map = list2Map(t2List, getT2Key);

        for(T1 t1 : t1List){
            K k = getT1Key.getKey(t1);
            T2 t2 = t2Map.get(k);
            if(t2 != null){
                callBack.callBack(t1, t2);
            }
            else {
                if(execNull != null){
                    execNull.accept(t1);
                }
            }
        }

        return t1List;
    }

    /**
     * 一对多时匹配
     * @param t1List
     * @param t2List
     * @param getT1Key
     * @param getT2Key
     * @param callBack
     * @param <T1>
     * @param <T2>
     * @param <K>
     * @return
     */
    public static <T1, T2, K> List<T1> eachA2BListByKey(List<T1> t1List, List<T2> t2List, List2MapGetKeyFn<K, T1> getT1Key, List2MapGetKeyFn<K, T2> getT2Key, BeanUtilsCallBack<T1, List<T2>> callBack){
        Map<K, List<T2>> t2Map = list2ListMap(t2List, getT2Key);

        for(T1 t1 : t1List){
            K k = getT1Key.getKey(t1);
            List<T2> t2 = t2Map.get(k);
            if(t2 != null){
                callBack.callBack(t1, t2);
            }
        }
        return t1List;
    }

    /**
     * 判断list铲毒
     * @param list
     * @param <T>
     * @return
     */
    static public <T> boolean isSize(List<T> list){
        if(list == null || list.size() < 1){
            return false;
        }

        return true;
    }

    /**
     * 多条件分组拼接id用
     * @param id
     * @return
     */
    static public String joinIds(long ...id){
        List<String> ids = new ArrayList<>();
        for(long v : id){
            ids.add(String.valueOf(v));
        }
        return String.join(",", ids);
    }

    /**
     * 多条件拼接
     * @param id
     * @return
     */
    static public String joinObjs(Object ...id){
        List<String> ids = new ArrayList<>();
        for(Object v : id){
            ids.add(String.valueOf(v));
        }
        return String.join(",", ids);
    }

    /**
     * list版本的转换key
     * @param id
     * @return
     */
    static public List<Object> toObjsKey(Object ...id){
        List<Object> ids = new ArrayList<>();
        for(Object v : id){
            ids.add(String.valueOf(v));
        }

        return ids;
    }

    // Todo 谁看懂了了相关代码帮忙吧注释加上
    static public <T> List<T> addElement(List<T> list, T element, boolean effect) {
        List<T> newList = new ArrayList<>();
        if (effect) {
            newList = list;
        } else {
            newList.addAll(list);
        }
        newList.add(element);
        return newList;
    }
}
