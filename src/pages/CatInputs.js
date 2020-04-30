import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';


const CatInputs = ({ idx, catState, handleCatChange }) => {
    const catId = `name-${idx}`;
    const ageId = `age-${idx}`;
    catState[idx].name = idx + 1;
    return (
        <div key={`cat-${idx}`} style={styles.container}>
            <input
                style={styles.label}
                type="text"
                name={catId}
                data-idx={idx}
                id={catId}
                className="name"
                value={catState[idx].name}
                onChange={handleCatChange}
            />
            <input
                style={styles.input}
                type="text"
                name={ageId}
                data-idx={idx}
                id={ageId}
                className="age"
                value={catState[idx].age}
                onChange={handleCatChange}
            />
        </div>
    );
};

CatInputs.propTypes = {
    idx: PropTypes.number,
    catState: PropTypes.array,
    handleCatChange: PropTypes.func,
};

const styles = {
    container: { backgroundColor: '#ddd', width: 400, margin: '5 5', display: 'flex', flexDirection: 'row', paddingTop: 1, paddingBottom:1 },
    label: { color: 'black', border: 'grey', backgroundColor: '#ddd', padding: 3, fontSize: 14, width: 20, margin: 1, marginLeft: 8 },
    input: { color: 'black', border: 'grey', backgroundColor: 'white', padding: 3, fontSize: 14, width: 350, margin: 1 },
}


export default CatInputs;
