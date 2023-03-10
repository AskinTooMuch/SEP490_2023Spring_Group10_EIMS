import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Modal } from 'react-bootstrap'
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Breed = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let navigate = useNavigate();
    const routeChange = (index) => {
        navigate('/breeddetail', { state: { id: index } });
    }
    const [images, setImages] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    //URL
    const NEW_BREED = '/api/breed/new';
    const SPECIE_LIST = '/api/specie/list';
    const BREED_LIST = '/api/breed/detail/userId';

    //Specie List
    const [loadedSpecie, setLoadedSpecie] = useState(false);
    const [specieList, setSpecieList] = useState([]);
    //BreedList
    const [loadedBreed, setLoadedBreed] = useState(false);
    const [breedList, setBreedList] = useState([]);

    //Breed DTOs
    const [newBreedDTO, setNewBreedDTO] = useState(
        {
            specieId: "",
            breedName: "",
            averageWeightMale: "",
            averageWeightFemale: "",
            commonDisease: "",
            growthTime: "",
            image: null
        }
    );
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

    //Get breed list
    useEffect(() => {
        if (loadedBreed) return;
        loadBreedList();
        setLoadedBreed(true);
    })

    // Request breed list and load the breed list into the table rows
    const loadBreedList = async () => {
        const result = await axios.get(BREED_LIST,
            { params: { userId: sessionStorage.getItem("curUserId") } },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                withCredentials: false
            });
        setBreedList(result.data);
        console.log(breedList);
    }

    //Handle on image change
    useEffect(() => {
        if (images.length < 1) return;
        const newImageUrls = [];
        images.forEach(image => newImageUrls.push(URL.createObjectURL(image)));
        setImageURLs(newImageUrls);
    }, [images]);

    const onImageChange = async (e) => {
        const file = e.target.files[0];
        newBreedDTO.image = file;
        console.log(newBreedDTO.image);
        setImages([...e.target.files]);
    }

    //Handle on input change
    const handleChange = (event, field) => {
        let actualValue = event.target.value
        setNewBreedDTO({
            ...newBreedDTO,
            [field]: actualValue
        })
        console.log(newBreedDTO);
    }

    //Send request new breed through Axios
    const handleNewSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('specieId', newBreedDTO.specieId);
        formData.append('breedName', newBreedDTO.breedName);
        formData.append('averageWeightMale', newBreedDTO.averageWeightMale);
        formData.append('averageWeightFemale', newBreedDTO.averageWeightFemale);
        formData.append('commonDisease', newBreedDTO.commonDisease);
        formData.append('growthTime', newBreedDTO.growthTime);
        formData.append('image', newBreedDTO.image);
        console.log(formData);
        try {
            const response = await axios.post(NEW_BREED,
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
            loadBreedList();
            toast.success("T???o lo??i m???i th??nh c??ng")
            setShow(false)
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
        <div>
            <nav className="navbar justify-content-between">
                <button className='btn btn-light' onClick={handleShow} id="startCreateBreed">+ Th??m</button>
                <Modal show={show} onHide={handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered >
                    <form onSubmit={handleNewSubmit}>
                        <Modal.Header closeButton onClick={handleClose}>
                            <Modal.Title>Th??m lo???i tr???ng</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="changepass">
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <p>Lo??i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                    </div>
                                    <div className="col-md-6">
                                        <select className="form-control mt-1" aria-label="Default select example"
                                        required
                                            onChange={e => handleChange(e, "specieId")}>
                                            <option disabled value="">Open this select menu</option>
                                            { /**JSX to load options */}
                                            { specieList &&
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
                                        <input required id = "createSpecieName"
                                            style={{ width: "100%" }}
                                            onChange={e => handleChange(e, "breedName")} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>C??n n???ng trung b??nh con ?????c<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                    </div>
                                    <div className="col-md-6">
                                        <input id="createBreedMaleAvg" required style={{ width: "100%" }}
                                        placeholder="kg"
                                        type='number'
                                        min='0'
                                        step='0.01'
                                            onChange={e => handleChange(e, "averageWeightMale")} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>C??n n???ng trung b??nh con c??i<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                    </div>
                                    <div className="col-md-6">
                                        <input id="createBreedFemaleAvg" required style={{ width: "100%" }}
                                        placeholder="kg"
                                        type='number'
                                        min='0'
                                        step='0.01'
                                            onChange={e => handleChange(e, "averageWeightFemale")} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <p>Th???i gian l???n l??n<FontAwesomeIcon className="star" icon={faStarOfLife} /></p>
                                    </div>
                                    <div className="col-md-6">
                                        <input id="createBreedGrownTime" required style={{ width: "100%" }}
                                        placeholder="ng??y"
                                        type='number'
                                        min='0'
                                        step='1'
                                            onChange={e => handleChange(e, "growthTime")} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <p>C??c b???nh th?????ng g???p</p>
                                    </div>
                                    <div className="col-md-6">
                                        <textarea id="createBreedCommondisease" style={{ width: "100%" }}
                                            onChange={e => handleChange(e, "commonDisease")} 
                                            placeholder="?????u g??, c??m g??, kh?? ch??n, giun s??n,..."
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <p>H??nh ???nh</p>
                                    </div>
                                    <div className="col-md-6">
                                        <input id="createBreedImg" type="file" multiple accept="image/*" onChange={onImageChange} />
                                        {imageURLs.map(imageSrc => <img style={{ width: "100%", minHeight: "100%" }} alt='' src={imageSrc} />)}
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <div className='model-footer'>
                            <button style={{ width: "20%" }} type="submit" className="col-md-6 btn-light" id="confirmCreateBreed">
                                T???o
                            </button>
                            <button className='btn btn-light' style={{ width: "20%" }} onClick={handleClose} id="cancelCreateBreed">
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
                            <input id = "searchBreed" type="text" className="form-control" placeholder="T??m ki???m" aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                    </form>
                </div>
            </nav>
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">T??n lo???i</th>
                            <th scope="col">C??n n???ng con ?????c</th>
                            <th scope="col">C??n n???ng con c??i</th>
                            <th scope="col">Th???i gian l???n</th>
                        </tr>
                    </thead>
                    <tbody>
                        { /**JSX to load breed list */}
                        { breedList &&
                            breedList.map((item, index) => (
                                item.status &&
                                <tr className='trclick' onClick={() => routeChange(item.breedId)} key={item.breedId}>
                                    <th scope="row">{index+1}</th>
                                    <td>{item.breedName}</td>
                                    <td>{item.averageWeightMale}</td>
                                    <td>{item.averageWeightFemale}</td>
                                    <td>{item.growthTime}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
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
    );
}
export default Breed;