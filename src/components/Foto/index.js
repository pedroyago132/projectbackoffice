import React, { useState } from 'react';

const YourComponent = ({ item, remedioIndex,setUpdatedPhotosAtual }) => {
    const [updatedPhotos, setUpdatedPhotos] = useState(''); // Para armazenar as novas fotos

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUpdatedPhotos(reader.result)
                setUpdatedPhotosAtual(reader.result)
            };
            reader.readAsDataURL(file); // Converte o arquivo em uma URL Base64
        }
    };
    return (
        <>
            <label
                htmlFor={`file-input-${remedioIndex}`}
                style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: 10
                }}
            >
                Trocar Foto
            </label>
            <input
                id={`file-input-${remedioIndex}`}
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event)}
                style={{ display: "none" }}
            />
          {
            updatedPhotos && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Nova Foto:</label>
                <img
                    src={updatedPhotos} // Mostra a nova foto carregada
                    alt={`Preview`}
                    style={{ maxWidth: "70%", maxHeight: "200px" }}
                />
            </div>
            ) 
          }
           
        </>
    );
};

export default YourComponent;
