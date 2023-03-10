import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../css/machine.css'
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from 'react-bootstrap'
import chicpic from '../pics/gari.png'
function BreedDetails(props) {
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
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

BreedDetails.propTypes = {
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
    //Dependency
    const [breedLoaded, setBreedLoaded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadedSpecie, setLoadedSpecie] = useState(false);

    //URL
    const SPECIE_LIST = '/api/specie/list';
    const BREED_GET = '/api/breed/detail/breedId';
    const BREED_GET_IMAGE = '/api/breed/detail/breedId/image';
    const BREED_DELETE = '/api/breed/delete';
    const BREED_EDIT = '/api/breed/edit';

    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [images, setImages] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    //List data
    const [specieList, setSpecieList] = useState([]);

    //DTO
    const [editBreedDTO, setEditBreedDTO] = useState(
        {
            breedId: "",
            specieId: "",
            breedName: "",
            specieName: "",
            averageWeightMale: "",
            averageWeightFemale: "",
            commonDisease: "",
            growthTime: "",
            image: "",
            status: false
        }
    );

    const [x64image, setX64image] = useState();

    //Get sent params with data
    const { state } = useLocation();
    const { id } = state;
    //Get specie list
    useEffect(() => {
        if (loadedSpecie) return;
        loadSpecieList();
        setLoadedSpecie(true);
    }, []);

    // Request specie list and load the specie list into the dropdowns
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

    //Get breed details
    useEffect(() => {
        console.log("Get breed");
        loadBreed();
    }, [breedLoaded]);

    const loadBreed = async () => {
        const result = await axios.get(BREED_GET,
            { params: { breedId: id } },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                withCredentials: false
            });
        // Set inf
        editBreedDTO.breedId = result.data.breedId;
        editBreedDTO.specieId = result.data.specieId;
        editBreedDTO.breedName = result.data.breedName;
        editBreedDTO.specieName = result.data.specieName;
        editBreedDTO.averageWeightMale = result.data.averageWeightMale;
        editBreedDTO.averageWeightFemale = result.data.averageWeightFemale;
        editBreedDTO.commonDisease = result.data.commonDisease;
        editBreedDTO.growthTime = result.data.growthTime;
        editBreedDTO.status = result.data.status;
        setBreedLoaded(true);
    }

    //Get image:
    useEffect(() => {
        console.log("Get breed");
        loadImage();
    }, [imageLoaded]);

    const loadImage = async () => {
        const result = await axios.get(BREED_GET_IMAGE,
            { params: { breedId: id } },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                withCredentials: false
            });
        // Set inf
        setX64image(result.data);
        setImageLoaded(true);
    }

    //handle on image change
    useEffect(() => {
        if (images.length < 1) return;
        const newImageUrls = [];
        images.forEach(image => newImageUrls.push(URL.createObjectURL(image)));
        setImageURLs(newImageUrls);
    }, [images]);

    const onImageChange = async (e) => {
        const file = e.target.files[0];
        editBreedDTO.image = file;
        editBreedDTO.status = true;
        console.log(editBreedDTO.image);
        setImages([...e.target.files]);
    }

    //Handle on input change
    const handleEditChange = (event, field) => {
        let actualValue = event.target.value
        setEditBreedDTO({
            ...editBreedDTO,
            [field]: actualValue
        })
    }
    //Handle submit delete breed
    const submitDeteteBreed = async () => {
        console.log("Delete breed " + id);
        try {
            const response = await axios.get(BREED_DELETE,
                { params: { breedId: editBreedDTO.breedId } },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: false
                });
            toast.success("X??a lo???i th??nh c??ng");
            navigate("/egg");
        } catch (err) {
            if (!err?.response) {
                toast.error('Server kh??ng ph???n h???i');
            } else if (err.response?.status === 400) {
                toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
            } else if (err.response?.status === 401) {
                toast.error('Unauthorized');
            }
            else {
                toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
            }
        }
    }
    
    //Send request new breed through Axios
    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('breedId', editBreedDTO.breedId);
        formData.append('specieId', editBreedDTO.specieId);
        formData.append('breedName', editBreedDTO.breedName);
        formData.append('averageWeightMale', editBreedDTO.averageWeightMale);
        formData.append('averageWeightFemale', editBreedDTO.averageWeightFemale);
        formData.append('commonDisease', editBreedDTO.commonDisease);
        formData.append('growthTime', editBreedDTO.growthTime);
        formData.append("image", editBreedDTO.image);
        console.log(formData);
        try {
            const response = await axios.post(BREED_EDIT,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: false
                }
            );
            console.log(JSON.stringify(response?.data));
            toast.success("L??u th??ng tin lo??i th??nh c??ng");
            window.location.reload();
        } catch (err) {
            if (!err?.response) {
                toast.error('Server kh??ng ph???n h???i');
            } else if (err.response?.status === 400) {
                toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
            } else if (err.response?.status === 401) {
                toast.error('Unauthorized');
            }
            else {
                toast.error('Y??u c???u kh??ng ????ng ?????nh d???ng');
            }
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'black' }}>
                <Tabs sx={{
                    '& .MuiTabs-indicator': { backgroundColor: "#d25d19" },
                    '& .Mui-selected': { color: "#d25d19" },
                }} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{ textTransform: "capitalize" }} label="Lo???i" {...a11yProps(0)} />
                    <Tab style={{ textTransform: "capitalize" }} label="Tr??? v??? trang Tr???ng" {...a11yProps(1)} onClick={() => navigate("/egg")} />
                </Tabs>
            </Box>
            <BreedDetails value={value} index={0}>
                <div className='container'>
                    <h3 style={{ textAlign: "center" }}>Th??ng tin lo???i</h3>
                    <Modal show={show} onHide={handleClose}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered >
                        <form onSubmit={handleEditSubmit}>
                            <Modal.Header closeButton onClick={handleClose}>
                                <Modal.Title>S???a th??ng tin lo???i tr???ng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="changepass">
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <p>Lo??i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <select class="form-select" aria-label="Default select example"
                                                onChange={e => handleEditChange(e, "specieId")}
                                                required>
                                                <option disabled>Open this select menu</option>
                                                { /**JSX to load options */}
                                                {specieList &&
                                                    specieList.map((item, index) => (
                                                        item.status &&
                                                        <option value={item.specieId}>{item.specieName}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <p>T??n lo???i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                required
                                                value={editBreedDTO.breedName}
                                                placeholder="G?? tre/G?? ri/G?? ????ng C???o/..."
                                                onChange={e => handleEditChange(e, "breedName")} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>C??n n???ng trung b??nh con ?????c<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <input required style={{ width: "100%" }}
                                                value={editBreedDTO.averageWeightMale}
                                                placeholder="(kg)"
                                                type='number'
                                                min='0'
                                                step='0.01'
                                                onChange={e => handleEditChange(e, "averageWeightMale")} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>C??n n???ng trung b??nh con c??i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <input required style={{ width: "100%" }}
                                                value={editBreedDTO.averageWeightFemale}
                                                placeholder="(kg)"
                                                type='number'
                                                min='0'
                                                step='0.01'
                                                onChange={e => handleEditChange(e, "averageWeightFemale")} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <p>Th???i gian l???n l??n<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                required
                                                value={editBreedDTO.growthTime}
                                                placeholder="S??? ng??y"
                                                type='number'
                                                min='0'
                                                onChange={e => handleEditChange(e, "growthTime")} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <p>C??c b???nh th?????ng g???p</p>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                value={editBreedDTO.commonDisease}
                                                placeholder="?????u g??, c??m g??, kh?? ch??n, giun s??n,..."
                                                onChange={e => handleEditChange(e, "commonDisease")} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <p>H??nh ???nh</p>
                                        </div>
                                        <div className="col-md-6">
                                            <input id="updateBreedImg" type="file" multiple accept="image/*" onChange={onImageChange} />
                                            {imageURLs.map(imageSrc => <img style={{ width: "100%", minHeight: "100%" }} alt='' src={imageSrc} />)}
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <div className='model-footer'>
                                <button style={{ width: "30%" }} className="col-md-6 btn-light" type='submit' id="confirmUpdateBreed">
                                    C???p nh???t
                                </button>
                                <button style={{ width: "20%" }} onClick={handleClose} className="btn btn-light" id="cancelUpdateBreed">
                                    Hu???
                                </button>
                            </div>
                        </form>
                    </Modal>
                    <div className='detailbody'>
                        <div className="row">
                            <div className="col-md-4">
                                <p >T??n lo??i
                                    <input style={{ display: "block" }} value={editBreedDTO.specieName} placeholder='G??/Ngan/Ng???ng' disabled />
                                </p>
                            </div>
                            <div className="col-md-4">
                                <p>H??nh ???nh</p>
                                <img style={{ position: "absolute", width: "20%", minHeight: "10%" }} alt='' src={`data:image/jpeg;base64,${x64image}`} />
                            </div>
                            {/*Buttons for edit and delete(deactivate) breed */}
                            <div className="col-md-4 ">
                                <div className='button'>
                                    <button id="startEditBreed" className='btn btn-light ' onClick={handleShow}>S???a</button>
                                    <button id="startDeleteBreed" className='btn btn-light ' onClick={() => submitDeteteBreed()} >Xo??</button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>T??n lo???i
                                    <input style={{ display: "block" }} value={editBreedDTO.breedName} placeholder='G?? ri/g?? tre,...' disabled />
                                </p>
                            </div>
                            <div className="col-md-4">
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>C??n n???ng trung b??nh con ?????c
                                    <input style={{ display: "block" }} value={editBreedDTO.averageWeightMale} placeholder='(kg)' disabled />
                                </p>
                            </div>
                            <div className="col-md-4" />
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>C??n n???ng trung b??nh con c??i
                                    <input style={{ display: "block" }} value={editBreedDTO.averageWeightFemale} placeholder='(kg)' disabled />
                                </p>
                            </div>
                            <div className="col-md-4" />
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>Th???i gian l???n l??n
                                    <input style={{ display: "block" }} value={editBreedDTO.growthTime} placeholder='S??? ng??y' disabled />
                                </p>
                            </div>
                            <div className="col-md-4" />
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <p>C??c b???nh th?????ng g???p
                                    <textarea style={{ display: "block" }}
                                        value={editBreedDTO.commonDisease}
                                        placeholder='C??m gia c???m, ?????u g??, ...'
                                        disabled />
                                </p>
                            </div>
                            <div className="col-md-4" />
                        </div>
                    </div>
                </div>
            </BreedDetails>
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
        </Box>
    );
}