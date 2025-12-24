import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
    return (
        <div className="text-center py-20">
            <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-gray-600 mb-8">
                Your payment is currently <b>Pending Verification</b>.
                <br />
                The admin will verify your UTR and update the status.
            </p>
            <div className="space-x-4">
                <Link to="/profile" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600">
                    View Orders
                </Link>
                <Link to="/" className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
