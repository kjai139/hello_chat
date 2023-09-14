import { RotatingLines } from "react-loader-spinner";


const Spinner = ({isLoading}) => {
    

    return (
        <div className="overlay">
            <RotatingLines
            strokeColor="black"
            strokeWidth="5"
            animationDuration="0.75"
            width="50"
            visible={isLoading}
            ></RotatingLines>
        </div>
    )
}

export default Spinner