import React,{useEffect,useState} from "react";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import { firestore } from './firebaseConfig';


export const Maintanence = ({ handleBack })=>{

    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    useEffect(() => {
        const fetch = async ()=>{
            try{
                const maintenanceCollection = collection(firestore, 'maintenance'); 
                const querySnapshot = await getDocs(maintenanceCollection);
                const fetchedRequests = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMaintenanceRequests(fetchedRequests);
            }catch(error){
                console.error('Error loading page:', error);
            }
        }
        fetch();
    }, []);
    


    return(
        <div className="maintenance-box">
            <h2>Maintenance Requests</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {maintenanceRequests.map(request => (
                    <div key={request.id} style={{ flex: '1 1 300px', border: '1px solid #ccc', padding: '20px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                        <h3>{request.maintenanceType}</h3>
                        <p><strong>Name:</strong> {request.name}</p>
                        <p><strong>Room Number:</strong> {request.roomNumber}</p>
                        <p><strong>Additional Details:</strong> {request.additionalDetails}</p>
                        {request.imageUrl && <img src={request.imageUrl} alt="Maintenance Image" style={{ maxWidth: '400px', maxHeight: '200px' }} />}
                    </div>
                ))}
            </div>
            <button onClick={handleBack} style={{padding:'20px', fontSize:'20px'}}>Back to Rooms</button>

        </div>
    )
}