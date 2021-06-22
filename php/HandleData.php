<?php

namespace App\Libs;

class HandleData
{
    /**
     * 转成数组， parent id 是0就是顶级
     * @param String $data 数据
     * @param String $parent_field 父级字段如ParentId，指向父级的字段
     * @param String $self_field   子级字段如Id，标明本身的字段
     * @param String $child_field  子级合集字段如children，子级的数组的字段
     */
    public function convertTree($data, $parent_field = "ParentId", $self_field = "Id", $child_field = "children")
    {
        $parent_ids = [0];
        $member_data = [];
        $pre_count = count($data);
        $now_count = 0;
        // while (count($data) > 0) {
        while ($pre_count != $now_count) {
            $tmp_parent_ids = [];
            $tmp_member_data = [];

            $now_id = array_column($data, $self_field);
            $now_parent_id = array_column($data, $parent_field);

            foreach ($data as $k => $v) {
                if (in_array($v[$parent_field], $parent_ids)) {
                    $tmp_member_data[] = $v;
                    $tmp_parent_ids[] = $v[$self_field];
                    unset($data[$k]);
                }
            }
            $parent_ids = $tmp_parent_ids;
            $member_data[] = $tmp_member_data;

            $pre_count = $now_count;
            $now_count = count($data);
        }

        $tree = [];

        for ($i = count($member_data) - 1; $i >= 0; $i--) {
            $tree = $this->mapDictDicts($member_data[$i], $tree, [$self_field], [$parent_field], function ($v1, $v2) use ($child_field) {
                $v1[$child_field] = [];
                foreach ($v2 as $key => $value) {
                    $v1[$child_field][] = $value;
                }
                return $v1;
            });
        }

        return $tree;
    }

    /**
     * 二维数组匹配后相同key值相加
     * @param Array $d 二维原数组
     * @param Array $eks 匹配key值
     * @param Array $aks 相加key值
     * @return Array 相加后的二维数据
     * --- eg: start ---
     * $arr = [
     *   ['a' => 1, 'b' => 2],
     *   ['a' => 1, 'b' => 2],
     *   ['a' => 2, 'b' => 2],
     * ];
     * print_r($HandleData->addionPropsArray($arr, ['a'], ['b']));
     * 
     * Array
     * (
     *     [0] => Array
     *         (
     *             [a] => 1
     *             [b] => 4
     *         )
     *     [1] => Array
     *         (
     *             [a] => 2
     *             [b] => 2
     *         )
     * )
     * --- eg: end   ---
     */
    public function addionPropsArray($d, $eks, $aks)
    {
        return $this->mapDicts($d, $eks, function ($arr) use ($aks) {
            $arr0 = $arr[0];
            foreach ($aks as $ak) {
                $akv_arr = array_column($arr, $ak);
                $arr0[$ak] = array_sum($akv_arr);
            }

            return $arr0;
        });
    }

    public function arrayPage($d, $page, $limit)
    {
        $count = count($d);
        $cur_idx = ($page - 1) * $limit;

        $new_d = array_slice($d, $cur_idx, $limit);
        return ['count' => $count, 'data' => $new_d];
    }

    public function distributePropsArrayTwoWay($d1, $d2, $k1, $k2, $p1, $p2)
    {
        return $this->mapDictDictTwoWay($d1, $d2, $k1, $k2, function ($v1, $v2) use ($k1, $k2, $p1, $p2) {
            $item = [];

            foreach ($k1 as $key => $v) {
                if (array_key_exists($v, $v1)) {
                    $item[$v] = $v1[$v];
                }
            }

            foreach ($k2 as $key => $v) {
                if (array_key_exists($v, $v2)) {
                    $item[$v] = $v2[$v];
                }
            }

            foreach ($p1 as $key => $v) {
                $item[$v[0]] = $this->getVal($v1, $v[1], $v[2]);
            }
            foreach ($p2 as $key => $v) {
                $item[$v[0]] = $this->getVal($v2, $v[1], $v[2]);
            }

            return $item;
        });
    }


    public function distributePropsArray($d1, $d2, $k1, $k2, $p)
    {
        return $this->mapDictDict($d1, $d2, $k1, $k2, function ($v1, $v2) use ($p) {
            foreach ($p as $key => $v) {
                $v1[$v[0]] = $this->getVal($v2, $v[1], $v[2]);
            }

            return $v1;
        });
    }


    public function mapDictDictTwoWay($d1, $d2, $k1, $k2, $fn)
    {
        $arr = [];
        $dict1 = $this->convertDict($d1, $k1);
        $dict2 = $this->convertDict($d2, $k2);

        $keys = array_keys($dict1);
        $keys = array_merge($keys, array_keys($dict2));
        $keys = array_flip(array_flip($keys));

        foreach ($keys as $keys_v) {
            $arr[] = $fn($this->getVal($dict1, $keys_v, []), $this->getVal($dict2, $keys_v, []), $keys);
        }
        return $arr;
    }


    public function mapDictsDicts($d1, $d2, $k1, $k2, $fn)
    {
        $arr = [];
        $dict1 = $this->convertDicts($d1, $k1);
        $dict2 = $this->convertDicts($d2, $k2);

        foreach ($dict1 as $key => $v) {
            $arr[] = $fn($v, $this->getVal($dict2, $key, []), $key);
        }

        return $arr;
    }



    public function mapDictDicts($d1, $d2, $k1, $k2, $fn)
    {
        $arr = [];
        $dict2 = $this->convertDicts($d2, $k2);

        foreach ($d1 as $key => $v) {
            $key = $this->convertKey($v, $k1);
            $arr[] = $fn($v, $this->getVal($dict2, $key, []), $key);
        }

        return $arr;
    }

    public function mapDictDict($d1, $d2, $k1, $k2, $fn)
    {
        $arr = [];
        $dict2 = $this->convertDict($d2, $k2);

        foreach ($d1 as $key => $v) {
            $key = $this->convertKey($v, $k1);
            $arr[] = $fn($v, $this->getVal($dict2, $key, []), $key);
        }

        return $arr;
    }

    public function mapDicts($d, $k, $fn)
    {
        $arr = [];
        $dicts = $this->convertDicts($d, $k);
        foreach ($dicts as $k => $v) {
            $arr[] = $fn($v, $k);
        }

        return $arr;
    }


    public function convertDicts($d, $k)
    {
        $dict = [];

        foreach ($d as $key => $v) {
            $key = $this->convertKey($v, $k);
            $dict[$key] = $this->getVal($dict, $key, []);
            $dict[$key][] = $v;
        }

        return $dict;
    }

    public function convertDict($d, $k)
    {
        $dict = [];

        foreach ($d as $key => $v) {
            $dict[$this->convertKey($v, $k)] = $v;
        }

        return $dict;
    }


    public function convertKey($d, $p)
    {
        $key_array = [];
        foreach ($p as $k => $v) {
            $key_array[] = $d[$v];
        }

        return $key = join(',', $key_array);
    }

    public function getVal($d, $k, $initval)
    {
        if ($d === null) return $initval;
        if (array_key_exists($k, $d)) {
            return $d[$k];
        }
        return $initval;
    }


    public function parseJson($obj)
    {
        return json_decode(json_encode($obj), true);
    }
}
