import React, { useState , useEffect, useRef} from 'react'
import {LoadScript, GoogleMap, StandaloneSearchBox, Marker} from '@react-google-maps/api';
import LoadingBox from '../components/LoadingBox';
import {USER_ADDRESS_MAP_CONFIRM} from '../constants/userConstants';
import { useDispatch } from 'react-redux';
import axios from 'axios';
const libs = ['places'];
const defaultLocation = { lat: 10.81978566792253, lng: 106.62883778898632};

export default function MapScreen(props) {
    const [googleApiKey,setGoogleApiKey] = useState('');
    const [center, setCenter] = useState(defaultLocation);
    const [location, setLocation] = useState(center);

    const mapRef = useRef(null);
    const placeRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const fetch =async () => {
            const {data} = await axios('/api/config/google');
            setGoogleApiKey(data);
            getUserCurrentLocation();
        }
        fetch()
    }, []);
    const onLoad = (map) => {
        mapRef.current = map;
    }
    const onMarkerLoad = (marker) => {
        markerRef.current = marker;
    }
    const onLoadPlaces = (place) => {
        placeRef.current = place;
    }
    const onIdle = () => {
        setLocation({
            lat:mapRef.current.center?.lat(),
            lng:mapRef.current.center?.lng()
        })
    }
    const onPlacesChanged = () => {
        const place = placeRef.current.getPlaces()[0].geometry.location;
        setCenter({lat:place.lat(),lng:place.lng()});
        setLocation({lat: place.lat() ,lng:place.lng()});
    }
    const dispatch = useDispatch();
    const onConfirm = () => {
        const places = placeRef.current.getPlaces();
        if(places?.length === 1){
            //dispatch select action
            dispatch({
                type:USER_ADDRESS_MAP_CONFIRM,
                payload:{
                    lat:location.lat,
                    lng:location.lng,
                    address:places[0].formatted_address,
                    name:"Please enter  consigne's name!",
                    country:places[0].address_components[places[0].address_components.length-1].long_name,
                    city:places[0].address_components[places[0].address_components.length-2].long_name,
                    vicinity:places[0].vicinity,
                    postalCode:"Please enter your postal code!",
                    googleAddress:places[0].place_id
                }
            });
            alert('location selected successfully');
            props.history.push('/shipping')
        }else{
            alert('Please enter your address');
        }
    }
    const getUserCurrentLocation = () => {
        if(!navigator.geolocation){
            alert(`Geolocation or not supported by this browser`);
        }else{
            navigator.geolocation.getCurrentPosition((position)=>{
                setCenter({
                    lat:position.coords.latitude,
                    lng:position.coords.longitude
                })
                setLocation({
                    lat:position.coords.latitude,
                    lng:position.coords.longitude
                })
            })
        }
    }
    return googleApiKey ? (
        <div className="full-container">
            <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                <GoogleMap
                    id="smaple-map"
                    mapContainerStyle={{height:'100%' , width:'100%'}}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onIdle={onIdle}>
                    <StandaloneSearchBox
                        onLoad={onLoadPlaces}
                        onPlacesChanged={onPlacesChanged}>
                        <div className="map-input-box">
                            <input type="text" placeholder="Enter your address"/>
                            <button
                                type="button"
                                onClick={onConfirm}>
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </StandaloneSearchBox>
                    <Marker position={location} onLoad={onMarkerLoad}></Marker>
                </GoogleMap>
            </LoadScript>
        </div>
    ):(
        <LoadingBox></LoadingBox>
    )
}
