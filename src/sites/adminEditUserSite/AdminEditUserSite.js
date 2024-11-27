import React, {useEffect, useState} from "react";
import {getArtColumns} from "../../assets/table-columns/tableArtColumns";
import {getReviewColumns} from "../../assets/table-columns/tableReviewColumns";
import {Table} from "../../components/table/Table";
import {Form} from "../../components/form/Form";
import {FormInput} from "../../components/formInput/FormInput";
import "./AdminEditUserSite.css"
import {Modal} from "../../components/modal/Modal";
import {useLocation, useParams} from "react-router-dom";
import axios from "axios";

// admin page
// TODO ked zmenim id v url a aj ked tam na zaciatku nic neni
//  ale user s id funguje tak ho updatne, treba zo zmenit ci to nechame
//  ako naschval bug ?

// TODO: overit vstupy pri editoch (modaly)
export function AdminEditUserSite() {
    const { id } = useParams();
    const location = useLocation();
    const {username: initialUsername, email: initialEmail } = location.state || {};
    const serverUrl = process.env.REACT_APP_SERVER_URL


    const [artData, setArtData] = useState([])
    const [artRecords, setArtRecords] = useState(artData)

    const [reviewData, setReviewData] = useState([])
    const [reviewRecords, setReviewRecords] = useState(reviewData)
    const [error, setError] = useState("")
    const [username, setUsername] = useState(initialUsername || "")
    const [email, setEmail] = useState(initialEmail || "")
    const [isArtModalOpen, setIsArtModalOpen] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

    const [artEditData, setArtEditData] = useState(
        {
            id: null,
            title: "",
            description: "",
            price: 0
        }
    )

    const [reviewEditData, setReviewEditData] = useState(
        {
            id: null,
            review_text: "",
            rating: ""
        }
    )


    const fetchArtData = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/art/read.php`, {
                params: { user_id: id }, // Pass query parameters here
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setArtData(response.data.data);
            setArtRecords(response.data.data);
        } catch (error) {
            console.error('Error fetching art data:', error);
        }
    };

    const fetchReviewData = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/review/read.php`, {
                params: { user_id: id }, // Pass query parameters here
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setReviewData(response.data.data);
            setReviewRecords(response.data.data);
        } catch (error) {
            console.error('Error fetching review data:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchArtData();
            fetchReviewData()
        } else {
            setError("No id provided")
        }
    }, [id]);


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

    const editReviewsHandler = (row) => {
        console.log(row);
        setReviewEditData({
            id: row.id,
            review_text: row.review_text,
            rating: row.rating,
        });
        setIsReviewModalOpen(true);
    }

    const columnsArts = getArtColumns(editArtsHandler)
    const columnsReviews = getReviewColumns(editReviewsHandler)


    const handleChange = ({selectedRows}) => {
        console.log('Selected Rows: ', selectedRows);
    };

    const handleArtFilter = (event) => {
        const eventValue = event.target.value
        const newData = artData.filter(row => {
            return row.id.toString().toLowerCase()
                    .includes(eventValue) ||
                row.img_url.toLowerCase()
                    .includes(eventValue.toLowerCase()) ||
                row.title.toLowerCase()
                    .includes(eventValue.toLowerCase()) ||
                row.description.toLowerCase()
                    .includes(eventValue.toLowerCase()) ||
                row.price.toString().toLowerCase()
                    .includes(eventValue) ||
                row.upload_date.toString().toLowerCase()
                    .includes(eventValue)
        });
        setArtRecords(newData);
    }

    const handleReviewFilter = (event) => {
        const eventValue = event.target.value.toLowerCase()
        const newData = reviewData.filter(row => {
            return row.id.toString()
                    .includes(eventValue) ||
                row.review_text.toLowerCase()
                    .includes(eventValue) ||
                row.rating.toString().toLowerCase()
                    .includes(eventValue) ||
                row.review_creation_date.toString().toLowerCase()
                    .includes(eventValue)
        });
        setReviewRecords(newData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting user edit");

        try {
            const response = await axios.put(`${serverUrl}/api/user/update.php`, {
                id, username, email,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            console.log(result);

            if (result.success) {
                setUsername(username);
                setEmail(email);
                alert("Updated successfully");
            }
        } catch (error) {
            setError(error);
            console.warn(error);
        }
    };

    const handleEditArtSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`${serverUrl}/api/art/update.php`, {
                id: artEditData.id,
                title: artEditData.title,
                description: artEditData.description,
                price: artEditData.price
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            if (result.success) {
                window.location.reload();
                alert("Updated successfully");
            }

        } catch (error) {
            setError(error);
            console.warn(error);
        }
    };

    const handleEditReviewSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`${serverUrl}/api/review/update.php`, {
                id: reviewEditData.id,
                review_text: reviewEditData.review_text,
                rating: reviewEditData.rating,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            if (result.success) {
                window.location.reload();
                alert("Updated successfully");
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


            <Modal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                title="Edit Review"
            >
                <Form
                    onSubmit={handleEditReviewSubmit}
                    error={error}
                    submitLabel="Apply changes"
                    buttonClassName="button-confirm"
                >
                    <FormInput
                        label="Review"
                        type="textarea"
                        rows="7"
                        value={reviewEditData.review_text}
                        onChange={(e) => setReviewEditData(
                            {
                                ...reviewEditData,
                                review_text: e.target.value
                            }
                        )}
                        required
                    />
                    {
                        //TODO osetrit min max
                        // hodnoty aj na serveri
                        // alebo to nechame ako feature bug
                        // ze user moze v html prepisat min a max
                        // a potom bude moct davat vyssi rating
                        // alebo tam miesto input type number pridame hviezdicky
                    }
                    <FormInput
                        label="Rating"
                        type="number"
                        max="5"
                        min="0"
                        value={reviewEditData.rating}
                        onChange={(e) => setReviewEditData(
                            {
                                ...reviewEditData,
                                rating: Number(e.target.value)
                            }
                        )}
                        required
                    />

                </Form>
            </Modal>
            <h1 className="text-center mb-2 mt-10">User - {username}</h1>
            <div className="edit-user-wrapper mb-4">
                <Form
                    onSubmit={handleSubmit}
                    error={error}
                    submitLabel="Edit"
                    buttonClassName="button-confirm"
                >
                    <FormInput
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </Form>
            </div>
            <h1 className="text-center mb-1">Arts</h1>
            <Table
                columns={columnsArts}
                records={artRecords}
                handleFilter={handleArtFilter}
                handleChange={handleChange}
                refreshData={fetchArtData}
                searchId="search-art-id"
            />

            <h1 className="text-center mb-1">Reviews</h1>
            <Table
                columns={columnsReviews}
                records={reviewRecords}
                handleFilter={handleReviewFilter}
                handleChange={handleChange}
                refreshData={fetchReviewData}
                searchId="search-review-id"

            />
        </>
    )

}