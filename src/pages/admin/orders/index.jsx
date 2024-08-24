// /admin/orders/index.jsx
import AdminLayout from '@/components/layout/adminLayout';
import axiosIntelence from '@/libs/axios';
import useFetchData from '@/services/useFetchData';
import { dateFormat, idrFormat } from '@/utils/format';
import { statusColor } from '@/utils/statusColor';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import SearchbarUI from '@/components/ui/searchbarUI'
import Link from 'next/link'

function OrderCard(props){
    const {background, color} = statusColor(props.status)

    return (
        <div className='relative my-3.5 p-2 text-sm rounded-md' style={{background: props.index / 2 === 0 && '#FFFFFF'}}>
            <Link href={{
                pathname: `orders/${props._id}`,
                query: props._id
            }}>
                <div>{dateFormat.format(new Date(props.createdAt))}</div>
                <div>{props.username}</div>
                <div>{idrFormat.format(props.totalAmount)}</div>
                <div style={{ background, color}} className='absolute right-2 top-2 p-1.5 rounded-md'>
                    {props.status.replace('diproses', 'dibayar').replace('_', ' ')}
                </div>
            </Link>
        </div>
    )
}

export default function UserOrders() {
    const { loading, result, setResult, fetchData } = useFetchData();
    const [ orderStatus, setOrderStatus] = useState('diproses')
    const {background, color} = statusColor(orderStatus)
    const [isFilter, setIsFilter] = useState(false)
    const [invalidID, setInvalidID] = useState(false)
    
    useEffect(() => {
        fetchData('/api/admin/orders');
    }, []);
    
    if (loading) return null
    
    function showFilterHandler(){ 
        setIsFilter(isFilter ? false : true)
    }
    
    // filter orders
    function FilterButton({children}){
        async function clickHandler(){
            try{
                const response = await axiosIntelence.get(`/api/admin/orders/status/${children}`)
                setResult(response.data.result)
                setOrderStatus(children)
                setIsFilter(false)
            } catch(error){
                console.error('filter order ;', error.message)
            }
        }
        
        return (
            <button
                className="capitalize w-full py-2.5 border-b-2"
                style={{ borderColor: 'var(--gray-primer)'}}
                onClick={clickHandler}
            >
                {children.replace('_', ' ').replace('diproses', 'dibayar')}
            </button>
        )
    }
    
    // all orders
    function allOrders() {
        fetchData('/api/admin/orders')
        setIsFilter(false)
        setOrderStatus('semua')
    }
    
    // change handler
    function changeHandler(event) {
        if(event.target.value.length > 0) {
            const timeout = setTimeout(async () => {
                const response = await axiosIntelence.get(`/api/admin/orders/search-id/${event.target.value}`)
                setResult(response.data.result)
                
                if(!response.data.result) {
                    setInvalidID(true)
                }
                setTimeout(() => {
                    setInvalidID(false)
                }, 3000)
            }, 500)
            
            return () => clearTimeout(timeout)
        }
    }
    
    return (
        <AdminLayout className={'p-3.5 capitalize'}>
            <section className='flex justify-between items-start'>
                <h2>Pesanan</h2>
            </section>
            <section className='my-3.5'>
                <div className="flex gap-2.5">
                    <button
                        style={{ background, color, shadowColor: color }}
                        className='px-2 py-1 rounded-md whitespace-nowrap shadow'
                        onClick={showFilterHandler}
                    >
                        <FontAwesomeIcon icon={faFilter} className='mr-2'/>
                        Filter: {orderStatus.replace('diproses', 'dibayar').replace('_', ' ')} [ {result?.length || 0} ]
                    </button>
                    <SearchbarUI onChange={changeHandler} invalidID={invalidID} placeholder='Cari Berdasarkan Order Id'/>
                </div>
                <nav className="my-3.5 duration-1000 overflow-hidden" style={{ height: isFilter ? 'max-content' : '0'}}>
                    <button
                        className="capitalize w-full py-2.5 border-b-2"
                        style={{ borderColor: 'var(--gray-primer)'}}
                        onClick={allOrders}
                    >
                        semua
                    </button>
                    <FilterButton>diproses</FilterButton>
                    <FilterButton>dikirim</FilterButton>
                    <FilterButton>selesai</FilterButton>
                    <FilterButton>menunggu_pembayaran</FilterButton>
                    <FilterButton>dibatalkan</FilterButton>
                </nav>
            </section>
            <section className='border-t-2'>
                {result?.map((order, index) =>
                    <OrderCard {...order} index={index} key={index}/>
                )}
            </section>
        </AdminLayout>
    );
}
