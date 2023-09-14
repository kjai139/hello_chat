import CloseCircle from '../../../../svgs/close-circle.svg'

const ResultModal = ({resultMsg, closeModal}) => {
    return (
        <div className='overlay'>
            <div className='flex flex-col flex-1 border-2 z-10 shadow-cont bg-white'>
                <div className='justify-end flex p-3'>
                
                <CloseCircle width="35" height="35" onClick={closeModal} className="hover-p"></CloseCircle>
                </div>
                <div className='flex flex-1 justify-center align-center p-3'>
                <h1 className='font-bold'>{resultMsg}</h1>
                </div>
            </div>
        </div>
    )
}


export default ResultModal