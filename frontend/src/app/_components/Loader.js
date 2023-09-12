import { RotatingLines } from "react-loader-spinner";


const Spinner = ({isLoading}) => {
    

    return (
        <div className="overlay">
            <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={isLoading}
            ></RotatingLines>
        </div>
    )
}

export default Spinner