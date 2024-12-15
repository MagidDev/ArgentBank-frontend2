import React from 'react';

function TransactionButton({ onClick }) {
  return (
    <button className="transaction-button" onClick={onClick}>
      View Transactions
    </button>
  );
}

export default TransactionButton;