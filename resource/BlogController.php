<?php 
class BlogController extends MY_Controller { 	

	/*
	*  constructor function
	*/
	public function __construct()
	{	
		parent::__construct();
		$this->load->model('BlogModel');
	}

	/*
	*  index function
	*/
	public function index()
	{	
		$data = array();
		$data['list'] = $this->BlogModel->get();
		$this->load->view('admin/blog/index', $data);
	}

	/*
	*  view function
	*/
	public function view($id)
	{	
		$data = array();
		$data['list'] = $this->BlogModel->get($id);
		$this->load->view('admin/blog/view', $data);
	}

	/*
	*  create function
	*/
	public function create()
	{	
		$this->load->view('admin/blog/create');
	}

	/*
	*  store function
	*/
	public function store()
	{	
		$object = array();
		$this->BlogModel->save($object);
		$this->session->set_flashdata('info', 'Successfully Saved!');
		return redirect('admin/blog/create');
	}

	/*
	*  edit function
	*/
	public function edit($id)
	{	
		$this->load->view('admin/blog/edit');
	}

	/*
	*  update function
	*/
	public function update($id)
	{	
		$object = array();
		$this->BlogModel->update($object, $id);
		$this->load->view('admin/blog/update');
	}

	/*
	*  destroy function
	*/
	public function destroy($id)
	{	
		$this->BlogModel->destroy($id);
		$this->load->view('admin/blog/destroy');
	}
}
?>