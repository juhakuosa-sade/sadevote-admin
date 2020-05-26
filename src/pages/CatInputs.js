import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';


const CatInputs = ({ idx, catState, handleCatChange }) => {
    const numId = `catNumber-${idx}`;
    const textId = `catText-${idx}`;
    const voteId = `catVotes-${idx}`;
    catState[idx].catNumber = idx + 1;
    return (
        <div key={`cat-${idx}`} style={styles.container}>
            <input
                style={styles.label}
                type="text"
                name={numId}
                data-idx={idx}
                id={numId}
                className="catNumber"
                value={catState[idx].catNumber}
                onChange={handleCatChange}
            />
            <input
                style={styles.input}
                type="text"
                name={textId}
                data-idx={idx}
                id={textId}
                className="catText"
                value={catState[idx].catText}
                onChange={handleCatChange}
            />   
            <input
                style={styles.input}
                type="text"
                name={voteId}
                data-idx={idx}
                id={voteId}
                className="catVotes"
                value={catState[idx].catVotes}
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
    container: { backgroundColor: '#ddd', width: 400, margin: '5 0', display: 'flex', flexDirection: 'row', paddingTop: 1, paddingBottom:1 },
    label: { color: 'black', border: 'grey', backgroundColor: '#ddd', padding: 3, fontSize: 14, width: 20, margin: 0, marginLeft: 8 },
    input: { color: 'black', border: 'grey', backgroundColor: 'white', padding: 8, fontSize: 12, width: 290, margin: 0 },
}


export default CatInputs;
