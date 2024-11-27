import {SearchBar} from "../../components/searchBar/SearchBar";
import "./MainSite.css"
import "../../table.css"
import {ReviewList} from "../../components/reviewList/ReviewList";
import {Art} from "../../components/art/Art";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Modal} from "../../components/modal/Modal";
import {Form} from "../../components/form/Form";
import {FormInput} from "../../components/formInput/FormInput";
import {StarRating} from "../../components/starRating/StarRating";
import axios from "axios";

export function MainSite() {
    // State to store arts and search term
    const [initialArtData, setInitialArtData] = useState([])
    const [arts, setArts] = useState([]);
    const [activeButton, setActiveButton] = useState(null); // Track the active button
    const [isOriginal, setIsOriginal] = useState(true); // Track if the original data is shown
    const [error, setError] = useState("")

    const [isArtModalOpen, setIsArtModalOpen] = useState(false)
    const [reviewText, setReviewText] = useState("")
    const [reviewRating, setReviewRating] = useState(0); // State to store the selected rating

    const [selectedArtId, setSelectedArtId] = useState(null); // store the selected art id

    const [email, setEmail] = useState(localStorage.getItem("user-email"))

    const navigate = useNavigate()

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const fetchData = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/art/read.php`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = response.data;

            if (result.success) {
                const artDataMap = [];

                // Iterate through the data to group reviews by art
                result.data.forEach(item => {
                    const artId = item.art_id;

                    // If this art already exists in the map, add the review to its reviews array
                    if (artDataMap[artId]) {
                        artDataMap[artId].reviews.push({
                            username: item.review_user_username,
                            date: item.review_creation_date,
                            reviewText: item.review_text,
                            rating: parseInt(item.rating, 10)
                        });
                    } else {
                        // If this is the first review for this art, initialize the entry
                        artDataMap[artId] = {
                            art_id: artId,
                            username: item.art_creator_username,
                            img_url: item.img_url,
                            title: item.title,
                            description: item.description,
                            price: parseFloat(item.price), // Convert price to number
                            date: item.upload_date,
                            reviews: item.review_user_username ? [{
                                username: item.review_user_username,
                                date: item.review_creation_date,
                                reviewText: item.review_text,
                                rating: parseInt(item.rating, 10)
                            }] : []  // Only add a review if there's a username
                        };
                    }
                });

                // Convert the map back into an array
                const artData = Object.values(artDataMap).map(art => {
                    const totalRating = art.reviews.reduce((acc, review) => acc + review.rating, 0);
                    const averageRating = art.reviews.length > 0 ? totalRating / art.reviews.length : 0; // Avoid division by zero
                    return {
                        ...art,
                        averageRating // Add the average rating to the art object
                    };
                });

                // Sort arts by average rating
                const sortedArtData = artData.sort((a, b) => b.averageRating - a.averageRating); // Descending order
                setArts(sortedArtData);
                setInitialArtData(sortedArtData);

                setArts(artData);
                setInitialArtData(artData);
            }
        } catch (error) {
            console.error("Error fetching art and reviews data: ", error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        console.log("Current arts data:", arts);
    }, [arts]);

    // Function to reset to original state
    const resetToOriginal = () => {
        setArts(initialArtData);
        setActiveButton(null); // Reset active button
        setIsOriginal(true); // Indicate we're back to the original state
    };

    const toggleSortByPriceAsc = () => {
        if (activeButton === 'priceAsc') {
            resetToOriginal();
            return
        }
        const sortedArts = [...arts].sort((a, b) => a.price - b.price);
        setArts(sortedArts);
        setActiveButton('priceAsc');
        setIsOriginal(false);

    };

    const toggleSortByPriceDesc = () => {
        if (activeButton === 'priceDesc') {
            resetToOriginal();
            return
        }
        const sortedArts = [...arts].sort((a, b) => b.price - a.price);
        setArts(sortedArts);
        setActiveButton('priceDesc');
        setIsOriginal(false);

    };

    // Sort by average rating
    const toggleSortByRatingAsc = () => {
        if (activeButton === 'ratingAsc') {
            resetToOriginal();
            return
        }
        const sortedArts = [...arts].sort((a, b) => a.averageRating - b.averageRating);
        setArts(sortedArts);
        setActiveButton('ratingAsc');
        setIsOriginal(false);
    };

    const toggleSortByRatingDesc = () => {
        if (activeButton === 'ratingDesc') {
            resetToOriginal();
            return
        }
        const sortedArts = [...arts].sort((a, b) => b.averageRating - a.averageRating);
        setArts(sortedArts);
        setActiveButton('ratingDesc');
        setIsOriginal(false);
    };

    // Handle search filtering
    const handleFilter = (event) => {
        const searchValue = event.target.value.toLowerCase();

        const newData = initialArtData.filter(row => {
            return row.title.toLowerCase().includes(searchValue)
        })
        setArts(newData)
    };

    const redirectToUploadArt = () => {
        email !== null || email === ""
            ? navigate("upload-art", {state: {email}}) : navigate("/login")
    }

    const openReviewModal = (artId) => {
        // TODO: display error that show that user is not logged in and only logged in user can
        //  upload review

        setSelectedArtId(artId); // set the art id when opening the modal
        setIsArtModalOpen(true); // open the modal
    };
    const handleReviewSubmit = async (e) => {
        // Submit review with selectedArtId, reviewText, and rating
        e.preventDefault()
        try {
            const response = await axios.post(`${serverUrl}/api/review/create.php`, {
                email: email,
                art_id: selectedArtId,
                review_text: reviewText,
                rating: reviewRating
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = response.data;

            if (result.success) {
                console.log("success");
                setIsArtModalOpen(false);
                window.location.reload();
            }
        } catch (error) {
            setError(error.message);
            console.error("Error submitting review: ", error);
        }
    };

    return (
        <>
            <Modal
                isOpen={isArtModalOpen}
                onClose={() => setIsArtModalOpen(false)}
                title="Add Review"
            >
                <Form error={error}
                      buttonClassName="button-dark"
                      onSubmit={handleReviewSubmit}
                      submitLabel="Add review">
                    <FormInput type="hidden" value={selectedArtId}/>

                    <FormInput
                        label="Review Text"
                        type="text"
                        value={reviewText}
                        onChange={(e) => {setReviewText(e.target.value)}}
                        required
                    />
                    <StarRating
                        rating={reviewRating}
                        setRating={setReviewRating}/>
                </Form>

            </Modal>
            <div className="main-content">
                <h1 className="text-center">Discover new Arts</h1>
                <section className="main-header-wrapper">
                    <SearchBar
                        searchId="main-searchbar"
                        handleFilter={handleFilter}
                        placeholder="Search for art..."
                    />
                    <div className="button-wrapper">
                        <button
                            onClick={toggleSortByPriceAsc}
                            className={activeButton === 'priceAsc' ? 'active' : ''}
                        >
                            Price <i className="bi bi-arrow-up"></i>
                        </button>
                        <button
                            onClick={toggleSortByPriceDesc}
                            className={activeButton === 'priceDesc' ? 'active' : ''}
                        >
                            Price <i className="bi bi-arrow-down"></i>
                        </button>
                        <button
                            onClick={toggleSortByRatingAsc}
                            className={activeButton === 'ratingAsc' ? 'active' : ''}
                        >
                            Rating <i className="bi bi-arrow-up"></i>
                        </button>
                        <button
                            onClick={toggleSortByRatingDesc}
                            className={activeButton === 'ratingDesc' ? 'active' : ''}
                        >
                            Rating <i className="bi bi-arrow-down"></i>
                        </button>
                    </div>
                </section>

                {/* Render filtered arts */}
                {arts.map((art, index) => (
                    <section className="art-review-wrapper mb-3" key={index}>
                        <Art art={art}/>
                        <ReviewList reviews={art.reviews}
                                    openReviewModal={() => openReviewModal(art.art_id)}/>
                    </section>
                ))}


                <button className="create-art button-confirm" onClick={redirectToUploadArt}>
                    Upload Art
                    <i className="bi bi-plus"></i>
                </button>
                {/*<div className="create-art">*/}
                {/*    <p>Create Art</p>*/}
                {/*    <i className="bi bi-plus-circle-fill"></i>*/}
                {/*</div>*/}

            </div>
        </>
    )
}