import React, { useEffect, useState } from "react";
import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const AdmissionApplications = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const collectionRef = collection(firestore, "Users");
                const querySnapshot = await getDocs(collectionRef);
                const fetchedDocuments = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setDocuments(fetchedDocuments);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchDocuments();
    }, []);

    return (
        <div>
            <div>
                <h1>Data from Firestore</h1>
                <ul>
                    {documents.map(document => (
                        <li key={document.id}>
                            <div>
                                <div>Name: {document.Name}</div>
                                <div> Email: {document.Email}</div>
                                {/* Render other fields similarly */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
