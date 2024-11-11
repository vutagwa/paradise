import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc, addDoc } from "firebase/firestore";
import '../../styles/point.css'; // Import your CSS file

const PointsDashboard = ({ userId }) => {
  const [userPoints, setUserPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [rewardStatus, setRewardStatus] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [newDonationAmount, setNewDonationAmount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchUserPoints();
      fetchRewards();
      fetchTransactionHistory();
    } else {
      console.error("User ID is undefined or invalid.");
    }
  }, [userId]);

  const fetchUserPoints = async () => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "userPoints", userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setUserPoints(userData.points || 0);
        setRewardStatus(userData.rewardStatus || "");
      } else {
        console.log("No such user data!");
      }
    } catch (error) {
      console.error("Error fetching user points:", error);
    }
  };

  const fetchRewards = async () => {
    try {
      const db = getFirestore();
      const rewardsSnapshot = await getDocs(collection(db, "rewards"));
      const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRewards(rewardsList);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const db = getFirestore();
      const historySnapshot = await getDocs(collection(db, `transactionHistory_${userId}`));
      const historyList = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactionHistory(historyList);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  const redeemReward = async (rewardId, pointsRequired) => {
    if (userPoints >= pointsRequired) {
      const db = getFirestore();
      await updateDoc(doc(db, "userPoints", userId), {
        points: userPoints - pointsRequired,
        rewardStatus: "redeemed",
      });

      // Log transaction
      await logTransaction("redeem", pointsRequired, `Redeemed reward: ${rewardId}`);

      setUserPoints(userPoints - pointsRequired);
      setRewardStatus("redeemed");
      alert("Reward redeemed successfully!");
    } else {
      alert("Not enough points to redeem this reward.");
    }
  };

  const logTransaction = async (type, amount, description) => {
    const db = getFirestore();
    await addDoc(collection(db, `transactionHistory_${userId}`), {
      type,
      amount,
      description,
      date: new Date(),
    });

    // Fetch the updated transaction history after logging
    fetchTransactionHistory();
  };

  const handleDonation = async () => {
    if (newDonationAmount > 0 && newDonationAmount <= userPoints) {
      const db = getFirestore();
      await updateDoc(doc(db, "userPoints", userId), {
        points: userPoints - newDonationAmount,
      });

      // Log donation transaction
      await logTransaction("donation", newDonationAmount, "Donation made");

      setUserPoints(userPoints - newDonationAmount);
      setNewDonationAmount(0);
      alert("Donation successful!");
    } else {
      alert("Invalid donation amount.");
    }
  };

  return (
    <div>
      <h2>Points Dashboard</h2>
      <p>You have <strong>{userPoints}</strong> points.</p>
      <p>Reward Status: <strong>{rewardStatus}</strong></p>

      <h3>Available Rewards</h3>
      <div className="rewards-list">
        {rewards.map(reward => (
          <div key={reward.id} className="reward-item">
            <p><strong>{reward.description}</strong></p>
            <p>Points Required: {reward.pointsRequired}</p>
            <button
              disabled={userPoints < reward.pointsRequired || rewardStatus === "redeemed"}
              onClick={() => redeemReward(reward.id, reward.pointsRequired)}
            >
              Redeem
            </button>
          </div>
        ))}
      </div>

      <h3>Transaction History</h3>
      <div className="transaction-history">
        {transactionHistory.length > 0 ? (
          transactionHistory.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <p>{transaction.date.toDate().toLocaleString()}: {transaction.type} of {transaction.amount} points. <em>{transaction.description}</em></p>
            </div>
          ))
        ) : (
          <p>No transaction history available.</p>
        )}
      </div>

      <div className="donation-section">
        <h3>Make a Donation</h3>
        <input
          type="number"
          value={newDonationAmount}
          onChange={(e) => setNewDonationAmount(Number(e.target.value))}
          placeholder="Enter donation amount"
        />
        <button onClick={handleDonation}>Donate Points</button>
      </div>
    </div>
  );
};

export default PointsDashboard;
