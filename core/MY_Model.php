<?php defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Model extends CI_model {
    /**
     * @var String the  table name
     */
    protected $_table_name   = '';

    /**
     * @var String the fields of table
     */
    protected $_table_fields = '';

    /**
     * @var String sorting by this field
     */
    protected $_order_by     = 'id ASC';

    /**
	* @name Constructor method.
	* @description Load dependencies.
	*
	* @return void
	*/
    public function __construct()
    {
        parent::__construct();
    }

    /**
    * Get records form database.
    *
    * @param Array $filter
    * @return Array
    */
    public function get($filter = array(), $limit = '', $offset = '', $or_like = array())
    {
        if(!empty($this->_table_fields)){
            $this->db->select($this->_table_fields);
        }
        
        if(!empty($this->_order_by)){
            $this->db->order_by($this->_order_by);
        }

        if(count($filter) > 0){
            foreach($filter as $k => $v){
                $this->db->where($k, $v);
            }
        }

        if(!empty($or_like)){
            $this->db->or_like($or_like);
        }

        if($limit != ''){
            if($offset != ''){
                $this->db->limit($limit, $offset);
            }else{
                $this->db->limit($limit);
            }
        }

        return $this->db->get($this->_table_name)->result_array();
  }

/**
 * Save/update model.
 *
 * @param Array $data to insert
 * @param Int $id
 * @return Int $id
 */
    public function save($data = array(), $id = NULL)
    {
        if($id === NULL){
            $this->db->insert($this->_table_name, $data);
            $id = $this->db->insert_id();
            $affected = 1;
        }else{
            $this->db->set($data);
            $this->db->where('id', $id);
            $this->db->update($this->_table_name);
            $affected = $this->db->affected_rows();
        }
        return array('success' => TRUE, 'affected' => $affected, 'id' => $id);
    }

    /**
    * Destroy record by id.
    *
    * @param  Int $id
    * @return Int The number of affected rows
    */
    public function destroy($id)
    {
        $this->db->where('id', $id);
        $this->db->delete($this->_table_name);
        return $this->db->affected_rows();
    }
}

?>