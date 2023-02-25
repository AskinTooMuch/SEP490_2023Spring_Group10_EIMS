import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Modal, Button } from 'react-bootstrap'
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { integerPropType } from '@mui/utils';
const Species = () => {

  const errRef = useRef();
  const [specieList, setSpecieList] = useState([]);
  // Create new specie JSON
  const [newSpecieDTO, setNewSpecieDTO] = useState({
    phone: sessionStorage.getItem("curPhone"),
    specieName: "",
    incubationPeriod: ""
  })
  // Save specie JSON
  const [editSpecieDTO, setEditSpecieDTO] = useState({
    specieId: "",
    specieName: "",
    incubationPeriod: ""
  })
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const list_fetched_ref = useRef(false);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  // Define urls
  const SPECIE_LIST = '/api/specie/list';
  const SPECIE_EDIT_GET = '/api/specie/edit/get';
  const SPECIE_EDIT_SAVE = '/api/specie/edit/save';
  const SPECIE_DELETE = '/api/specie/delete';
  const SPECIE_NEW = "/api/specie/new";

  //Handle change: update new specie JSON
  const handleChange = (event, field) => {
    let actualValue = event.target.value
    setNewSpecieDTO({
      ...newSpecieDTO,
      [field]: actualValue
    })
  }

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(SPECIE_NEW,
        newSpecieDTO,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          withCredentials: false
        }
      );
      setNewSpecieDTO('');
      toast.success("Tạo loài mới thành công")
      setShow2(false);
    } catch (err) {
      if (!err?.response) {
        toast.error('Server không phản hồi');
      } else if (err.response?.status === 400) {
        toast.error('Mật khẩu cũ không đúng');
      } else if (err.response?.status === 401) {
        toast.error('Unauthorized');
      } else {
        toast.error('Sai mật khẩu');
      }
      errRef.current.focus();
    }
  }
  // Handle submit to send request to API (Create new specie)
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(SPECIE_NEW,
        newSpecieDTO,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          withCredentials: false
        }
      );
      setNewSpecieDTO('');
      
      toast.success("Tạo loài mới thành công")
      setShow(false)
      window.location.reload(false);
    } catch (err) {
      if (!err?.response) {
        toast.error('Server không phản hồi');
      } else if (err.response?.status === 400) {
        toast.error('Mật khẩu cũ không đúng');
      } else if (err.response?.status === 401) {
        toast.error('Unauthorized');
      } else {
        toast.error('Sai mật khẩu');
      }
      errRef.current.focus();
    }
  }
  //

  // Get list of specie and show
  //Get specie list
  useEffect(() => {
    if (list_fetched_ref.current) return;
    list_fetched_ref.current = true;
    loadSpecieList();
  }, []);

  // Request specie list and load the specie list into the table rows
  const loadSpecieList = async () => {
    console.log("axios run");
    const result = await axios.get(SPECIE_LIST,
      { params: { userId: sessionStorage.getItem("curUserId") } },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        withCredentials: false
      });
    setSpecieList(result.data);
    console.log("Specie list :" + result.data);
  }

  // Load data into edit specie fields
  function LoadData(index){
    console.log(index);
    editSpecieDTO.specieId = specieList[index].specieId;
    editSpecieDTO.specieName = specieList[index].specieName;
    editSpecieDTO.incubationPeriod = specieList[index].incubationPeriod;
    setShow2(true);
  }

  return (
    <div>
      <nav className="navbar justify-content-between">
        <button className='btn btn-light' onClick={handleShow}>+ Thêm</button>
        <form><Modal show={show} onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered >
          <Modal.Header closeButton onClick={handleClose}>
            <Modal.Title>Thêm loài mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="changepass">
              <div className="row">
                <div className="col-md-6 ">
                  <p>Tên loài<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                </div>
                <div className="col-md-6">
                  <input placeholder='Gà, Ngan, Vịt, v.v' onChange={e => handleChange(e, "specieName")}
                    value={newSpecieDTO.specieName} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 ">
                  <p>Thời gian ấp<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                </div>
                <div className="col-md-6">
                  <input placeholder='Số ngày ấp' onChange={e => handleChange(e, "incubationPeriod")}
                    value={newSpecieDTO.incubationPeriod} />
                </div>
              </div>
            </div>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" style={{ width: "20%" }} onClick={handleClose}>
              Huỷ
            </Button>

            <Button variant="success" style={{ width: "20%" }} className="col-md-6" onClick={handleSubmit}>
              Tạo
            </Button>

          </Modal.Footer>
        </Modal>
        </form>
        <div className='filter my-2 my-lg-0'>
          <p><FilterAltIcon />Lọc</p>
          <p><ImportExportIcon />Sắp xếp</p>
          <form className="form-inline">
            <div className="input-group">
              <div className="input-group-prepend">
                <button ><span className="input-group-text" ><SearchIcon /></span></button>
              </div>
              <input type="text" className="form-control" placeholder="Tìm kiếm" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
          </form>
        </div>
      </nav>
      <div>
        <table className="table table-bordered" id="list_specie_table">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên loài</th>
              <th scope="col">Tổng thời gian ấp nở</th>
              <th scope="col"> </th>
            </tr>
          </thead>
          <tbody id="specie_list_table_body">
            {
              specieList.map((item, index) => (
                <tr key={item.specieId} data-key={index} className='trclick2' onClick={() => LoadData(index)}>
                  <th scope="row">{index+1}</th>
                  <td>{item.specieName}</td>
                  <td>{item.incubationPeriod} (ngày)</td>
                  <td><button className='btn btn-danger' style={{ width: "50%" }}>Xoá</button></td>

                </tr>
              ))
            }

            <form><Modal show={show2} onHide={() => handleClose2}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered >
              <Modal.Header closeButton onClick={handleClose2}>
                <Modal.Title>Sửa thông tin loài</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="speiciesfix">
                  <div className="row">
                    <div className="col-md-6 ">
                      <p>Tên loài<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                    </div>
                    <div className="col-md-6">
                      <input placeholder='Gà, Ngan, Vịt, v.v' id="editSpecieName" value={editSpecieDTO.specieName}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 ">
                      <p>Thời gian ấp<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                    </div>
                    <div className="col-md-6">
                      <input placeholder='Số ngày ấp' id="editIncubationPeriod" type={integerPropType} value={editSpecieDTO.incubationPeriod}/>
                    </div>
                  </div>
                </div>

              </Modal.Body>

              <Modal.Footer>
                <Button variant="danger" style={{ width: "20%" }} onClick={handleClose2}>
                  Huỷ
                </Button>

                <Button variant="success" style={{ width: "20%" }} className="col-md-6" onClick={handleSubmit2}>
                  Cập nhật
                </Button>

              </Modal.Footer>
            </Modal>
            </form>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Species;