import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getArtColumns} from "../../assets/table-columns/tableArtColumns";
import {Form} from "../../components/form/Form";
import {FormInput} from "../../components/formInput/FormInput";
import {Modal} from "../../components/modal/Modal";
import {Table} from "../../components/table/Table";
import axios from "axios";

export function UserArtsSite(){
    const navigate = useNavigate()

    const email =
        localStorage.getItem("user-email") ?
            localStorage.getItem("user-email") : navigate("/")
    //todo: dodat nejaky # pre zobrazenie ze neni prihlaseny


    const serverUrl = process.env.REACT_APP_SERVER_URL

    const [userArtData, setUserArtData] = useState([])
    const [userArtRecords, setUserArtRecords] = useState(userArtData)
    const [error, setError] = useState("")

    const [isArtModalOpen, setIsArtModalOpen] = useState(false)

    const [artEditData, setArtEditData] = useState(
        {
            id: null,
            title: "",
            description: "",
            price: 0
        }
    )

    const fetchArtData = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/art/read.php`, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    user_email: email,
                },
            });

            const result = response.data;
            console.log(result);
            setUserArtData(result.data);
            setUserArtRecords(result.data);

        } catch (error) {
            console.error("Error fetching art data: ", error);
        }
    };

    useEffect(() => {
        fetchArtData()
    }, [])

    const editArtsHandler = (row) => {
        console.log(row)
        setArtEditData({
            id: row.id,
            title: row.title,
            description: row.description,
            price: Number(row.price),
        })
        setIsArtModalOpen(true)
    }

    const columnsArts = getArtColumns(editArtsHandler)

    const handleArtFilter = (event) => {
        const eventValue = event.target.value.toLowerCase()
        const newData = userArtData.filter(row => {
            return row.id.toString().toLowerCase()
                    .includes(eventValue) ||
                row.img_url.toLowerCase()
                    .includes(eventValue) ||
                row.title.toLowerCase()
                    .includes(eventValue) ||
                row.description.toLowerCase()
                    .includes(eventValue) ||
                row.price.toString().toLowerCase()
                    .includes(eventValue) ||
                row.upload_date.toString().toLowerCase()
                    .includes(eventValue)
        });
        setUserArtData(newData);
    }

    // TODO: code duplicate in AdminEditUserSite
    const handleEditArtSubmit = async () => {
        console.log(artEditData);
        try {
            const response = await axios.put(`${serverUrl}/api/art/update.php`, {
                id: artEditData.id,
                title: artEditData.title,
                description: artEditData.description,
                price: artEditData.price,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            if (result.success) {
                window.location.reload();
                alert("Successfully");
            }

        } catch (error) {
            setError(error);
            console.warn(error);
        }
    };

    return (
        <>
            <Modal
                isOpen={isArtModalOpen}
                onClose={() => setIsArtModalOpen(false)}
                title="Edit Art"
            >
                <Form
                    onSubmit={handleEditArtSubmit}
                    error={error}
                    submitLabel="Apply changes"
                    buttonClassName="button-confirm"
                >
                    <FormInput
                        label="Title"
                        type="text"
                        value={artEditData.title}
                        onChange={(e) => setArtEditData(
                            {
                                ...artEditData,
                                title: e.target.value
                            }
                        )}
                        required
                    />
                    <FormInput
                        label="Description"
                        type="textarea"
                        rows="7"
                        value={artEditData.description}
                        onChange={(e) => setArtEditData(
                            {
                                ...artEditData,
                                description: e.target.value
                            }
                        )}
                        required
                    />
                    <FormInput
                        label="Price (€)"
                        type="number"
                        value={artEditData.price}
                        onChange={(e) => setArtEditData(
                            {
                                ...artEditData,
                                price: Number(e.target.value)
                            }
                        )}
                        required
                    />

                </Form>

            </Modal>
            <h1 className="text-center mb-4 mt-10">Arts</h1>
            <Table
                columns={columnsArts}
                records={userArtRecords}
                handleFilter={handleArtFilter}
                refreshData={fetchArtData}
                searchId="search-art-id"
            />
        </>

    )
}