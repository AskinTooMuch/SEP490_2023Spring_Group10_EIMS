import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Modal } from 'react-bootstrap'
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmBox from './ConfirmBox';
const Species = () => {
  const [open, setOpen] = useState(false);
  const [specieList, setSpecieList] = useState([]);
  //ConfirmBox
  function openDelete() {
    setOpen(true);
  }
  // Create new specie JSON
  const [newSpecieDTO, setNewSpecieDTO] = useState({
    userId: sessionStorage.getItem("curUserId"),
    specieName: '',
    incubationPeriod: '',
    embryolessDate: '',
    diedEmbryoDate: '',
    hatchingDate: ''
  })
  // Save specie JSON
  const [editSpecieDTO, setEditSpecieDTO] = useState({
    specieId: "",
    specieName: "",
    incubationPeriod: "",
    embryolessDate: "",
    diedEmbryoDate: "",
    hatchingDate: ""
  })
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);

  // Define urls
  const SPECIE_LIST = '/api/specie/list';
  const SPECIE_EDIT_SAVE = '/api/specie/edit/save';
  const SPECIE_DELETE = '/api/specie/delete';
  const SPECIE_NEW = "/api/specie/new";

  //Handle change: update new specie JSON
  const handleNewSpecieChange = (event, field) => {
    let actualValue = event.target.value
    setNewSpecieDTO({
      ...newSpecieDTO,
      [field]: actualValue
    })
  }

  //Handle change: update edit specie JSON
  const handleEditSpecieChange = (event, field) => {
    let actualValue = event.target.value
    setEditSpecieDTO({
      ...editSpecieDTO,
      [field]: actualValue
    })
  }

  //Handle submit: update specie
  const handleEditSpecieSubmit = async (event) => {
    event.preventDefault();
    console.log(editSpecieDTO);
    if (!validate("edit")) return;
    try {
      const response = await axios.post(SPECIE_EDIT_SAVE,
        editSpecieDTO,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          withCredentials: false
        }
      );
      setEditSpecieDTO({
        specieId: "",
        specieName: "",
        incubationPeriod: "",
        embryolessDate: "",
        diedEmbryoDate: "",
        hatchingDate: ""
      });
      console.log(response)
      loadSpecieList();
      toast.success("S???a th??ng tin lo??i th??nh c??ng");
      setShow2(false);
    } catch (err) {
      if (!err?.response) {
        toast.error('Server kh??ng ph???n h???i');
      } else if (err.response?.status === 400) {
        toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
      } else if (err.response?.status === 401) {
        toast.error('Kh??ng c?? quy???n th???c hi???n h??nh ?????ng n??y');
      } else {
        toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
      }
    }
  }

  //Validate inputs
  function validate(type) {
    let dtos;
    switch (type) {
      case "new": dtos = newSpecieDTO;
        break;
      case "edit": dtos = editSpecieDTO;
        break;
      default: return;
    }
    if (dtos.specieName.trim() === "") {
      toast.error("T??n lo??i kh??ng ????? tr???ng");
      return false;
    }
    return true;
  }
  // Handle submit to send request to API (Create new specie)
  const handleNewSpecieSubmit = async (event) => {
    event.preventDefault();
    console.log(newSpecieDTO);
    //Validate and toasts
    if (!validate("new")) return;

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
      setNewSpecieDTO({
        userId: sessionStorage.getItem("curUserId"),
        specieName: "",
        incubationPeriod: "",
        embryolessDate: "",
        diedEmbryoDate: "",
        hatchingDate: ""
      });
      console.log(response)
      loadSpecieList();
      toast.success("T???o lo??i m???i th??nh c??ng");
      setShow(false);
    } catch (err) {
      if (!err?.response) {
        toast.error('Server kh??ng ph???n h???i');
      } else if (err.response?.status === 400) {
        toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
      } else if (err.response?.status === 401) {
        toast.error('Kh??ng c?? quy???n th???c hi???n h??nh ?????ng n??y');
      } else {
        toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
      }
    }
  }
  //

  // Handle submit to send request to API (Delete specie)
  const handleDelete = async (index) => {
    try {
      const response = await axios.get(SPECIE_DELETE,
        { params: { specieId: specieList[index].specieId } },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          withCredentials: false
        });
      console.clear(response)
      setOpen(false);
      loadSpecieList();
      toast.success("X??a lo??i th??nh c??ng");
    } catch (err) {
      if (!err?.response) {
        toast.error('Server kh??ng ph???n h???i');
      } else if (err.response?.status === 400) {
        toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
      } else if (err.response?.status === 401) {
        toast.error('Kh??ng c?? quy???n th???c hi???n h??nh ?????ng n??y');
      } else {
        toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
      }
    }
  }
  //

  // Get list of specie and show
  //Get specie list
  useEffect(() => {
    loadSpecieList();
  }, []);

  // Request specie list and load the specie list into the table rows
  const loadSpecieList = async () => {
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
    console.log(specieList);
  }

  // Load data into edit specie fields
  function LoadData(index) {
    console.log(index);
    setEditSpecieDTO(specieList[index]);
    // editSpecieDTO.specieId = specieList[index].specieId;
    // editSpecieDTO.specieName = specieList[index].specieName;
    // editSpecieDTO.incubationPeriod = specieList[index].incubationPeriod;
    // editSpecieDTO.embryolessDate = specieList[index].embryolessDate;
    // editSpecieDTO.diedEmbryoDate = specieList[index].diedEmbryoDate;
    // editSpecieDTO.
    setShow2(true);
  }

  return (
    <div>
      <nav className="navbar justify-content-between">
        <div className='filter my-2 my-lg-0'>
          <p><FilterAltIcon />L???c</p>
          <p><ImportExportIcon />S???p x???p</p>
          <form className="form-inline">
            <div className="input-group">
              <div className="input-group-prepend">
                <button ><span className="input-group-text" ><SearchIcon /></span></button>
              </div>
              <input type="text" className="form-control" placeholder="T??m ki???m" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
          </form>
        </div>
        <button id="startCreateSpecie" className='btn btn-light' onClick={handleShow}>+ Th??m</button>
        <Modal show={show} onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered >
          <form onSubmit={handleNewSpecieSubmit}>
            <Modal.Header closeButton onClick={handleClose}>
              <Modal.Title>Th??m lo??i m???i</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Add new specie form */}
              <div className="changepass">
                {/**Basic inf */}
                <div className="row">
                  <div className="col-md-6 ">
                    <p>T??n lo??i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                  </div>
                  <div className="col-md-6">
                    <input placeholder='G??, Ngan, V???t, v.v'
                      onChange={e => handleNewSpecieChange(e, "specieName")}
                      value={newSpecieDTO.specieName}
                      required
                      className="form-control" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 ">
                    <p>Th???i gian ???p<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                  </div>
                  <div className="col-md-6">
                    <input placeholder='S??? ng??y ???p'
                      onChange={e => handleNewSpecieChange(e, "incubationPeriod")}
                      value={newSpecieDTO.incubationPeriod}
                      type="number"
                      min="0"
                      required
                      className="form-control" />
                  </div>
                </div>
                {/**Incubation phase inf: only 3 params are needed; the rest could be auto-generated*/}
                <div className="row">
                  <div className="col-md-6 ">
                    <p>Ng??y x??c ?????nh c??c giai ??o???n ???p c???a tr???ng</p>
                  </div>
                  <div className="col-md-6">
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 ">
                    <p>Tr???ng tr???ng/tr??n (tr???ng kh??ng c?? ph??i)&nbsp;<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                  </div>
                  <div className="col-md-6">
                    <input placeholder='Ng??y th??? ...'
                      onChange={e => handleNewSpecieChange(e, "embryolessDate")}
                      value={newSpecieDTO.embryolessDate}
                      type="number"
                      min="0"
                      max={newSpecieDTO.incubationPeriod}
                      required
                      className="form-control" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 ">
                    <p>Tr???ng lo??ng/t??u (ph??i ch???t non)&nbsp;<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                  </div>
                  <div className="col-md-6">
                    <input placeholder='Ng??y th??? ...'
                      onChange={e => handleNewSpecieChange(e, "diedEmbryoDate")}
                      value={newSpecieDTO.diedEmbryoDate}
                      type="number"
                      min={newSpecieDTO.embryolessDate}
                      max={newSpecieDTO.incubationPeriod}
                      required
                      className="form-control" />
                  </div>
                  <div className="col-md-6 ">
                    <p>Tr???ng ??ang n???&nbsp;<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                  </div>
                  <div className="col-md-6">
                    <input placeholder='Ng??y th??? ...'
                      onChange={e => handleNewSpecieChange(e, "hatchingDate")}
                      type="number"
                      min={newSpecieDTO.diedEmbryoDate}
                      max={newSpecieDTO.incubationPeriod}
                      value={newSpecieDTO.hatchingDate}
                      required
                      className="form-control" />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <div className='model-footer'>
              <button style={{ width: "20%" }} type="submit" className="col-md-6 btn-light" >
                T???o
              </button>
              <button className='btn btn-light' style={{ width: "20%" }} onClick={handleClose}>
                Hu???
              </button>
            </div>
          </form>
        </Modal>


      </nav>
      <div>
        {/*Table for list of species */}
        <section className="u-align-center u-clearfix u-section-1" id="sec-b42b">
          <div className="u-clearfix u-sheet u-sheet-1">
            <div className="u-expanded-width u-table u-table-responsive u-table-1">
              <table className="u-table-entity u-table-entity-1" id="list_specie_table">
                <colgroup>
                  <col width="5%" />
                  <col width="40%" />
                  <col width="35%" />
                  <col width="20%" />
                </colgroup>
                <thead className="u-palette-4-base u-table-header u-table-header-1">
                  <tr style={{ height: "21px" }}>
                    <th className="u-border-1 u-border-custom-color-1 u-palette-2-base u-table-cell u-table-cell-1" scope="col">STT</th>
                    <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-2" scope="col">T??n lo??i</th>
                    <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-2" scope="col">T???ng th???i gian ???p n???</th>
                    <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-2" scope="col"> </th>
                  </tr>
                </thead>
                <tbody id="specie_list_table_body" className="u-table-body">
                  { /**JSX to load rows */}
                  {
                    specieList.map((item, index) => (
                      item.status &&
                      <tr key={item.specieId} data-key={index} className='trclick2' style={{ height: "21px" }}>
                        <th className="u-border-1 u-border-grey-30 u-first-column u-grey-5 u-table-cell u-table-cell-5" scope="row" onClick={() => LoadData(index)}>{index + 1} </th>
                        <td className="u-border-1 u-border-grey-30 u-table-cell" onClick={() => LoadData(index)}>{item.specieName}</td>
                        <td className="u-border-1 u-border-grey-30 u-table-cell" onClick={() => LoadData(index)}>{item.incubationPeriod} (ng??y)</td>
                        <td className="u-border-1 u-border-grey-30 u-table-cell" style={{textAlign:"center"}}><button className='btn btn-light' style={{ width: "50%" }} onClick={() => openDelete()}>Xo??</button>
                          <ConfirmBox open={open} closeDialog={() => setOpen(false)} title={item.specieName} deleteFunction={() => handleDelete(index)}
                          />
                        </td>
                      </tr>
                    ))
                  }
                  {/**Popup edit spicies */}
                  <Modal show={show2} onHide={() => handleClose2}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onSubmit={handleEditSpecieSubmit}>
                    {/**Edit species */}
                    <form>
                      <Modal.Header closeButton onClick={handleClose2}>
                        <Modal.Title>S???a th??ng tin lo??i</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="speiciesfix">
                          {/**Basic inf */}
                          <div className="row">
                            <div className="col-md-6 ">
                              <p>T??n lo??i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                            </div>
                            <div className="col-md-6">
                              <input placeholder='G??, Ngan, V???t, v.v' id="editSpecieName"
                                value={editSpecieDTO.specieName}
                                onChange={e => handleEditSpecieChange(e, "specieName")}
                                required
                                className='form-control' />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 ">
                              <p>Th???i gian ???p<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                            </div>
                            <div className="col-md-6">
                              <input placeholder='S??? ng??y ???p'
                                id="editIncubationPeriod"
                                value={editSpecieDTO.incubationPeriod}
                                onChange={e => handleEditSpecieChange(e, "incubationPeriod")}
                                required
                                type="number"
                                min="0"
                                className='form-control' />
                            </div>
                          </div>
                          {/**Incubation phase inf: only 3 params are needed; the rest could be auto-generated*/}
                          <div className="row">
                            <div className="col-md-6 ">
                              <p>Ng??y x??c ?????nh c??c giai ??o???n ???p c???a tr???ng</p>
                            </div>
                            <div className="col-md-6">
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 ">
                              <p>Tr???ng tr???ng/tr??n (tr???ng kh??ng c?? ph??i)&nbsp;<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                            </div>
                            <div className="col-md-6">
                              <input placeholder='Ng??y th??? ...'
                                onChange={e => handleEditSpecieChange(e, "embryolessDate")}
                                value={editSpecieDTO.embryolessDate}
                                type="number"
                                min="0"
                                max={editSpecieDTO.incubationPeriod}
                                required
                                className="form-control" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 ">
                              <p>Tr???ng lo??ng/t??u (ph??i ch???t non)&nbsp;<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                            </div>
                            <div className="col-md-6">
                              <input placeholder='Ng??y th??? ...'
                                onChange={e => handleEditSpecieChange(e, "diedEmbryoDate")}
                                value={editSpecieDTO.diedEmbryoDate}
                                type="number"
                                min={editSpecieDTO.embryolessDate}
                                max={editSpecieDTO.incubationPeriod}
                                required
                                className="form-control" />
                            </div>
                            <div className="col-md-6 ">
                              <p>Tr???ng ??ang n???&nbsp;<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                            </div>
                            <div className="col-md-6">
                              <input placeholder='Ng??y th??? ...'
                                onChange={e => handleEditSpecieChange(e, "hatchingDate")}
                                type="number"
                                min={editSpecieDTO.diedEmbryoDate}
                                max={editSpecieDTO.incubationPeriod}
                                value={editSpecieDTO.hatchingDate}
                                required
                                className="form-control" />
                            </div>
                          </div>
                        </div>
                      </Modal.Body>
                      <div className='model-footer'>
                        <button style={{ width: "30%" }} type='submit' className="col-md-6 btn-light">
                          C???p nh???t
                        </button>
                        <button style={{ width: "20%" }} onClick={handleClose2} className="btn btn-light">
                          Hu???
                        </button>
                      </div>
                    </form>
                  </Modal>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {/**Th??ng b??o */}
        <ToastContainer position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" />
      </div>
    </div>
  );
}
export default Species;