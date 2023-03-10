import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../css/machine.css'
import { useNavigate } from "react-router-dom";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SearchIcon from '@mui/icons-material/Search';
import { Modal } from 'react-bootstrap'
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Employee(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="span">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

Employee.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let navigate = useNavigate();
    const routeChange = () => {
        let path = '/employeedetail';
        navigate(path);
    }
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'black' }}>
                <Tabs sx={{
                    '& .MuiTabs-indicator': { backgroundColor: "#d25d19" },
                    '& .Mui-selected': { color: "#d25d19" },
                }} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{ textTransform: "capitalize" }} label="Nh??n vi??n" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <Employee value={value} index={0}>
                <nav className="navbar justify-content-between">
                    <button className='btn btn-light' onClick={handleShow}>+ Th??m</button>
                    <Modal show={show} onHide={handleClose}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered >
                        <form>
                            <Modal.Header closeButton onClick={handleClose}>
                                <Modal.Title>S???a th??ng tin m??y</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>T??n nh??n vi??n<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                    </div>
                                    <div className="col-md-6">
                                        <input required style={{ width: "100%" }}  />
                                    </div>
                                    <div className="col-md-6">
                                        <p>S??? ??i???n tho???i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                    </div>
                                    <div className="col-md-6">
                                        <input required style={{ width: "100%" }} placeholder="0" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>M???t kh???u<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                    </div>
                                    <div className="col-md-6">
                                        <input required style={{ width: "100%" }} placeholder="0" />
                                    </div>
                                    <div className="col-md-6">
                                        <p>?????a ch???</p>
                                    </div>
                                    <div className="col-md-6">
                                        <textarea style={{ width: "100%" }} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>Email</p>
                                    </div>
                                    <div className="col-md-6">
                                        <input style={{ width: "100%" }} />
                                    </div>
                                    <div className="col-md-6">
                                        <p>L????ng<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                    </div>
                                    <div className="col-md-6">
                                        <input required style={{ width: "100%" }} placeholder="0" />
                                    </div>
                                </div>
                            </Modal.Body>
                            <div className='model-footer'>
                                <button style={{ width: "30%" }} className="col-md-6 btn-light" onClick={handleClose}>
                                    T???o
                                </button>
                                <button style={{ width: "20%" }} onClick={handleClose} className="btn btn-light">
                                    Hu???
                                </button>
                            </div>
                        </form>
                    </Modal>
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
                </nav>
                <div>
                    <section className="u-align-center u-clearfix u-section-1" id="sec-b42b">
                        <div className="u-clearfix u-sheet u-sheet-1">

                            <div className="u-expanded-width u-table u-table-responsive u-table-1">
                                <table className="u-table-entity u-table-entity-1">
                                    <colgroup>
                                        <col width="5%" />
                                        <col width="35%" />
                                        <col width="30%" />
                                        <col width="30%" />
                                    </colgroup>
                                    <thead className="u-palette-4-base u-table-header u-table-header-1">
                                        <tr style={{ height: "21px" }}>
                                            <th className="u-border-1 u-border-custom-color-1 u-palette-2-base u-table-cell u-table-cell-1">STT</th>
                                            <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-2">T??n nh??n vi??n</th>
                                            <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-3">S??? ??i???n tho???i</th>
                                            <th className="u-border-1 u-border-palette-4-base u-palette-2-base u-table-cell u-table-cell-5">Tr???ng th??i</th>
                                        </tr>
                                    </thead>
                                    <tbody className="u-table-body">
                                        <tr style={{ height: "76px" }} onClick={routeChange}>
                                            <td className="u-border-1 u-border-grey-30 u-first-column u-grey-5 u-table-cell u-table-cell-5">1</td>
                                            <td className="u-border-1 u-border-grey-30 u-table-cell">Nguy???n Ho??ng D????ng</td>
                                            <td className="u-border-1 u-border-grey-30 u-table-cell">09124719471</td>
                                            <td className="u-border-1 u-border-grey-30 u-table-cell text-green">??ang ho???t ?????ng</td>
                                        </tr>
                                        <tr style={{ height: "76px" }}>
                                            <td className="u-border-1 u-border-grey-30 u-first-column u-grey-5 u-table-cell u-table-cell-9">2</td>
                                            <td className="u-border-1 u-border-grey-30 u-table-cell">Nguy???n V??n ?????c</td>
                                            <td className="u-border-1 u-border-grey-30 u-table-cell">09124719471</td>
                                            <td className="u-border-1 u-border-grey-30 u-table-cell text-red">Ngh??? vi???c</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </Employee>


        </Box>
    );
}