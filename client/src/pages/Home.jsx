import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper'
import ListingItem from '../components/ListingItem';


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  SwiperCore.use([Navigation])

  console.log(saleListings);

  useEffect(()=>{
    const fetchOfferListings  = async()=>{
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4')
        const data =  await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
          console.log(error);
      }
    }
    const fetchRentListings = async()=>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data =  await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
          console.log(error);
      }
    }
    const fetchSaleListings = async()=>{
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4')
        const data =  await res.json();
        setSaleListings(data)
        
      } catch (error) {
          console.log(error);
      }
    }

    fetchOfferListings();
  },[])

  return (
    <div>
      {/* top  */}
      <div className=" flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className=' text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find you next <span className=' text-slate-500'>perfect</span> <br /> place with ease
        </h1>
        <div className=" text-gray-500 text-xs sm:text-sm">
          Mern Estate is the best place to find your next perfect place to live. Our customers trusts us.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link className=' text-sm sm:text-md text-blue-800 font-bold hover:underline' to={`/search`}>
          Let's Start now....
          </Link>
      </div>


      {/* swiper  */}
      <Swiper navigation>
        {
          offerListings && offerListings.length>0 && offerListings.map((listing)=> (
            <SwiperSlide>
              <div style={{background: `url(${listing.imageURLs[0]}) center no-repeat`, backgroundSize :"cover"}} className=" h-[500px]" key={listing._id}>
              </div>
            </SwiperSlide>
            
          ))
        }

      </Swiper>
      
      
      {/* listing results  */}
        <div className=" max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
          {
            offerListings && offerListings.length>0 && (
              <div className="">
                <div className=" flex items-center justify-between my-3">
                  <h2 className=' text-3xl font-semibold text-slate-600'>Recent offers</h2>
                  <Link className=' text-blue-500' to={'/search?offer=true'}>{'Show More Offers>>'} </Link>
                </div>
                <div className=" flex flex-wrap gap-4 mt-4">
                  {
                    offerListings.map((listing)=>(
                      <ListingItem listing={listing} key={listing._id} />
                    ))
                  }
                </div>
              </div>
            )
          }
          {
            rentListings && rentListings.length>0 && (
              <div className="">
                <div className=" flex items-center justify-between my-3">
                  <h2 className=' text-3xl font-semibold text-slate-600'>Recent places for rent</h2>
                  <Link className=' text-blue-500' to={'/search?type=rent'}>{'Show More place for rent>>'} </Link>
                </div>
                <div className=" flex flex-wrap gap-4 mt-4">
                  {
                    rentListings.map((listing)=>(
                      <ListingItem listing={listing} key={listing._id} />
                    ))
                  }
                </div>
              </div>
            )
          }
          {
            saleListings && saleListings.length>0 && (
              <div className="">
                <div className=" flex items-center justify-between my-3">
                  <h2 className=' text-3xl font-semibold text-slate-600'>Recent places to buy</h2>
                  <Link className=' text-blue-500' to={'/search?offer=true'}>{'Show More place to buy>>'} </Link>
                </div>
                <div className=" flex flex-wrap gap-4 mt-4">
                  {
                    saleListings.map((listing)=>(
                      <ListingItem listing={listing} key={listing._id} />
                    ))
                  }
                </div>
              </div>
            )
          }
        </div>
    </div>
  )
}
