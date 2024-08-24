// /v1/user/cart
import Header from '@/components/common/header';
import ImageDisplay from '@/components/common/imageDisplay';
import CartProvider, { useCartContext } from '@/contexts/cartContext';
import { convertToIDR } from '@/utils/priceHandler';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useState } from 'react';

function CartCard(props) {
    const [quantity, setQuantity] = useState(props.quantity);

    function changeQuantity(event) {
        setQuantity(event.target.value);
    }

    function onBlurHandler() {
        props.changeQuantity(props._id, quantity)
    }

    function incrementHandler(){
        setQuantity(quantity + 1)
        props.changeQuantity(props._id, quantity + 1)
    }

    function decrementHandler() {
        if (quantity > 0) {
            setQuantity(quantity - 1);
            props.changeQuantity(props._id, quantity - 1)
        }
    }

    return (
        <figure
            className='flex gap-3.5 p-3.5'
            style={{ background: props.index / 2 !== 0 && '#FFF' }}
        >
            <ImageDisplay
                src={props.images[0]}
                className='aspect-square w-20 h-20'
            />
            <div className='w-full flex flex-col justify-between'>
                <span className='text-sm'>
                    <div className='font-semibold'>{props.name}</div>
                    <div className='text-gray-600'>{props.variantName}</div>
                </span>
                <span className='text-[var(--red-primer)] font-semibold'>
                    {convertToIDR.format(props.price)}
                </span>
            </div>
            <div className='flex flex-col justify-between text-sm'>
                <button
                    className='border rounded-md w-full p-1'
                    onClick={() => props.deleteHandler(props._id)}
                >
                    Hapus
                    <FontAwesomeIcon icon={faTrashCan} className='ml-3.5' />
                </button>
                <div className='flex items-center gap-1.5 border px-2 py-0 rounded-md bg-white border-[var(--black-primer)]-1'>
                    <FontAwesomeIcon
                        icon={faMinus}
                        onClick={decrementHandler}
                    />
                    <input
                        type='text'
                        value={quantity}
                        onChange={changeQuantity}
                        onBlur={onBlurHandler}
                        className='w-12 text-center px-1.5 py-1 border-l border-r bg-transparent outline-0'
                    />
                    <FontAwesomeIcon icon={faPlus} onClick={incrementHandler} />
                </div>
            </div>
        </figure>
    );
}

function CartPage() {
    const { loading, deleteHandler, changeQuantity, result, totalAmount } = useCartContext()
    const router = useRouter()

    if (loading) {
        return (
            <div>loading</div>
        )
    }

    // submit cart
    function submitCart() {
        if (result?.length > 0) {
            router.push('/v1/user/orders/create')
        }
    }

    return (
            <>
                {result.length > 0 ? (
                    result.map((item, index) => (
                        <CartCard
                            key={item._id}
                            deleteHandler={deleteHandler}
                            changeQuantity={changeQuantity}
                            {...item}
                            index={index}
                        />
                    ))
                ) : (
                    <div className='belum ada item'>belum ada ittem</div>
                )}
                <section className='fixed shadow w-full bottom-0 left-0 bg-white p-3.5 flex items-center'>
                    <span className='w-full text-left font-semibold'>
                        <div className='text-gray-600 -mb-2'>Total</div>
                        <div className='text-xl'>
                            {convertToIDR.format(totalAmount)}
                        </div>
                    </span>
                    <button className='btn btn-red w-full' onClick={submitCart}>checkout</button>
                </section>
            </>
    );
}


export default function UserCart() {
    return (
        <>
            <CartProvider>
                <Header backPath={-1}>
                    Keranjang saya
                </Header>
                <CartPage />
            </CartProvider>
        </>
    )
}