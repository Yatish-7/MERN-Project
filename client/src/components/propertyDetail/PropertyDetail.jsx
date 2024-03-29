import React, { useState, useRef, useEffect } from 'react';
import classes from './propertyDetail.module.css';

import { useSelector } from 'react-redux';
import { AiOutlineClose, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { request } from '../../util/fetchAPI';
import { FaBed, FaSquareFull, FaSmile, FaEye } from 'react-icons/fa';
import Rating from 'react-rating';

const PropertyDetail = () => {
  const { user } = useSelector((state) => state.auth);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState(0);
  const { id } = useParams();
  const formRef = useRef();

  const serviceID = process.env.REACT_APP_SERVICE_ID;
  const templateID = process.env.REACT_APP_TEMPLATE_ID;
  const imageUrl = 'http://localhost:8000' + '/images/' + user.profileImg;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await request(`/property/find/${id}`, 'GET');
        setPropertyDetail(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCloseForm = () => {
    setShowForm(false);
    setTitle('');
    setDesc('');
  };

  const handleContactOwner = async (e) => {
    e.preventDefault();
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <img src={`http://localhost:8000/images/${propertyDetail?.img}`} alt={propertyDetail?.title} />
        </div>
        <div className={classes.right}>
          <h3 className={classes.title}>Title: {`${propertyDetail?.title}`}</h3>
          <div className={classes.details}>
            <div className={classes.typeAndContinent}>
              <div>Type: <span>{`${propertyDetail?.type}`}</span></div>
              <div>Continent: <span>{`${propertyDetail?.continent}`}</span></div>
            </div>
            <div className={classes.priceAndOwner}>
              <span className={classes.price}>
                <span>Price: $</span> {`${propertyDetail?.price}`}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                Owner: <img src={imageUrl} alt={user?.username} className={classes.owner} />
              </span>
            </div>
            <div className={classes.moreDetails}>
              <span>
                {propertyDetail?.beds} <FaBed className={classes.icon} />
              </span>
              <span>
                {propertyDetail?.sqmeters} square meters <FaSquareFull className={classes.icon} />
              </span>
              <span>
                {propertyDetail?.views} views <FaEye className={classes.icon} />
              </span>
              <div className="rating">
                <Rating
                  initialRating={propertyDetail?.rating}
                  emptySymbol={<AiOutlineStar />}
                  fullSymbol={<AiFillStar />}
                  onChange={(value) => setRating(value)}
                />
                <span>({rating}/5)</span>
              </div>
            </div>
          </div>
          <p className={classes.desc}>
            Desc: <span>{`${propertyDetail?.desc}`}</span>
          </p>
          <button onClick={() => setShowForm(true)} className={classes.contactOwner}>
            Contact owner
          </button>
          <button onClick={() => window.open('https://forms.gle/mMK93PQKnDfviHc97', '_blank')} className={classes.contactOwner}>
            Write a review
          </button>
        </div>
      </div>
      {showForm && (
        <div className={classes.contactForm} onClick={handleCloseForm}>
          <div className={classes.contactFormWrapper} onClick={(e) => e.stopPropagation()}>
            <h2>Send Email To Owner</h2>
            <form onSubmit={handleContactOwner} ref={formRef}>
              <input value={user?.email} type="text" placeholder="My email" name="from_email" />
              <input value={user?.username} type="text" placeholder="My username" name="from_username" />
              <input value={propertyDetail?.currentOwner?.email} type="email" placeholder="Owner email" name="to_email" />
              <input value={title} type="text" placeholder="Title" name="from_title" onChange={(e) => setTitle(e.target.value)} />
              <input value={desc} type="text" placeholder="Desc" name="message" onChange={(e) => setDesc(e.target.value)} />
              <button>Send</button>
            </form>
            <AiOutlineClose onClick={handleCloseForm} className={classes.removeIcon} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;