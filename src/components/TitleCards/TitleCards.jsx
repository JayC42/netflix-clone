import React, { useRef, useEffect, useState } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'
import { Link } from 'react-router-dom'

const TitleCards = ({title, category, enableAutoScroll = true}) => {
const [apiData, setApiData] = useState([]);
const cardsRef = useRef(); 

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2VkMzVhMzZiOWFkZDNhNTNlYjU3ZjZlYjU0YmQxOCIsIm5iZiI6MTcyMjgzMzQxMC45OTA3MjQsInN1YiI6IjY2YjA1ODY3MjBhMjM3YTdlNWExMTdhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iYSI9VewGjVlIoszsGvPaQDD2KhiTbcvybUtVDf5AJs'
  }
};

 const [scrollPosition, setScrollPosition] = useState(0);

 const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
 }

 useEffect(() => {

  fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
  .then(response => response.json())
  .then(response => setApiData(response.results))
  .catch(err => console.error(err));

    const currentRef = cardsRef.current;
    currentRef.addEventListener('wheel', handleWheel);
    return () => currentRef.removeEventListener('wheel', handleWheel);
  }, []);
  

 useEffect(() => {
  if (enableAutoScroll) {
    const interval = setInterval(autoScroll, 3000);
    return () => clearInterval(interval);
  }
}, [scrollPosition]);
  
  const autoScroll = () => {
    const cardWidth = cardsRef.current.firstChild.offsetWidth;
    const scrollWidth = cardsRef.current.scrollWidth;
    const clientWidth = cardsRef.current.clientWidth;
  
    let newPosition = scrollPosition + cardWidth;
    
    if (newPosition + clientWidth > scrollWidth) {
      newPosition = 0;
    }
  
    cardsRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };
  
  
  return (
    <div className='title-cards'>
        <h2>{title?title:"Trending"}</h2>
        <div className="card-list" ref={cardsRef}>
            {apiData.map((card, index) => {
                return <Link to={`/player/${card.id}`}className="card" key={index}>
                    <img src={`https://image.tmdb.org/t/p/w500`+ card.backdrop_path} alt="" />
                    <p>{card.original_title}</p>
                </Link>
            })}
        </div>
    </div>
  )
}

export default TitleCards