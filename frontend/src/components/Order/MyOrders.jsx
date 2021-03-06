import { useEffect, useState } from "react";
import { myOrders, clearErrors } from "../../actions/orderAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layouts/Loader";
import { useSnackbar } from "notistack";
import OrderItem from "./OrderItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import SearchIcon from "@mui/icons-material/Search";
import MinCategory from "../Layouts/MinCategory";
import MetaData from "../Layouts/MetaData";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CircleIcon from "@mui/icons-material/Circle";
import { Link } from "react-router-dom";
import { formatDate, formatNumber } from "../../utils/functions";
const orderStatus = ["Processing", "Shipped", "Delivered", "Cancel"];
const dt = new Date();
const ordertime = [dt.getMonth(), dt.getFullYear() - 1, dt.getFullYear() - 2];

const MyOrders = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [status, setStatus] = useState("");
    const [orderTime, setOrderTime] = useState(0);
    const [search, setSearch] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);

    const { orders, loading, error } = useSelector((state) => state.myOrders);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        dispatch(myOrders());
    }, [dispatch, error, enqueueSnackbar]);

    useEffect(() => {
        if (loading === false) {
            setFilteredOrders(orders);
        }
    }, [loading, orders]);

    useEffect(() => {
        setSearch("");
        // console.log(status);
        // console.log(typeof orderTime);
        // console.log(orderTime);

        if (!status && +orderTime === 0) {
            setFilteredOrders(orders);
            return;
        }

        if (status && orderTime) {
            if (+orderTime === dt.getMonth()) {
                const filteredArr = orders.filter(
                    (order) =>
                        order.orderStatus === status &&
                        new Date(order.createdAt).getMonth() === +orderTime
                );
                setFilteredOrders(filteredArr);
            } else {
                const filteredArr = orders.filter(
                    (order) =>
                        order.orderStatus === status &&
                        new Date(order.createdAt).getFullYear() === +orderTime
                );
                setFilteredOrders(filteredArr);
            }
        } else if (!status) {
            if (+orderTime === dt.getMonth()) {
                const filteredArr = orders.filter(
                    (order) =>
                        new Date(order.createdAt).getMonth() === +orderTime
                );
                setFilteredOrders(filteredArr);
            } else {
                const filteredArr = orders.filter(
                    (order) =>
                        new Date(order.createdAt).getFullYear() === +orderTime
                );
                setFilteredOrders(filteredArr);
            }
        } else {
            const filteredArr = orders.filter(
                (order) => order.orderStatus === status
            );
            setFilteredOrders(filteredArr);
        }
        // eslint-disable-next-line
    }, [status, orderTime]);

    const searchOrders = (e) => {
        e.preventDefault();
        if (!search.trim()) {
            enqueueSnackbar("Empty Input", { variant: "warning" });
            return;
        }
        const arr = orders.map((el) => ({
            ...el,
            orderItems: el.orderItems.filter((order) =>
                order.name.toLowerCase().includes(search.toLowerCase())
            ),
        }));
        setFilteredOrders(arr);
    };

    const clearFilters = () => {
        setStatus("");
        setOrderTime(0);
    };
    console.log(orders);
    console.log(filteredOrders);
    return (
        <>
            <MinCategory />
            <main className="w-full mt-16 sm:mt-0">
                {/* <!-- row --> */}
                <div className="flex gap-3.5 mt-2 sm:mt-6 sm:mx-3 m-auto mb-7">
                    {/* <!-- sidebar column  --> */}
                    <div className="hidden sm:flex flex-col w-1/5 px-1">
                        {/* <!-- nav tiles --> */}
                        <div className="flex flex-col bg-white rounded-sm shadow">
                            {/* <!-- filters header --> */}
                            <div className="flex items-center justify-between gap-5 px-4 py-2 border-b">
                                <p className="text-lg font-medium">B??? l???c</p>
                                <span
                                    onClick={clearFilters}
                                    className="text-blue-600 font-medium text-sm uppercase cursor-pointer hover:text-blue-700"
                                >
                                    Xo?? t???t c???
                                </span>
                            </div>

                            {/* <!-- order status checkboxes --> */}
                            <div className="flex flex-col py-3 text-sm">
                                <span className="font-medium px-4">
                                    Tr???ng th??i ????n
                                </span>

                                {/* <!-- checkboxes --> */}
                                <div className="flex flex-col gap-3 px-4 mt-1 pb-3 border-b">
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="orderstatus-radio-buttons-group"
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                            name="orderstatus-radio-buttons"
                                            value={status}
                                            defaultValue="Processing"
                                        >
                                            {orderStatus
                                                .slice(0, 3)
                                                .map((el, i) => (
                                                    <FormControlLabel
                                                        value={el}
                                                        control={
                                                            <Radio size="small" />
                                                        }
                                                        key={i}
                                                        label={
                                                            <span className="text-sm">
                                                                {el ===
                                                                    "Cancel" &&
                                                                    " ????n h??ng ???? b??? hu???"}
                                                                {el ===
                                                                    "Processing" &&
                                                                    " ??ang x??? l??"}
                                                                {el ===
                                                                    "Shipped" &&
                                                                    " ??ang giao h??ng"}
                                                                {el ===
                                                                    "Delivered" &&
                                                                    " ???? nh???n h??ng"}
                                                            </span>
                                                        }
                                                    />
                                                ))}
                                            <FormControlLabel
                                                value={"Cancel"}
                                                control={<Radio size="small" />}
                                                label={
                                                    <span className="text-sm">
                                                        ????n h??ng ???? b??? hu???
                                                    </span>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                {/* <!-- checkboxes --> */}
                            </div>
                            {/* <!-- order status checkboxes --> */}
                        </div>
                        {/* <!-- nav tiles --> */}
                    </div>
                    {/* <!-- sidebar column  --> */}

                    {/* <!-- orders column --> */}
                    <div className="flex-1">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="flex flex-col gap-3 sm:mr-4 overflow-hidden">
                                {/* <!-- searchbar --> */}
                                <form
                                    onSubmit={searchOrders}
                                    className="flex items-center justify-between mx-1 sm:mx-0 sm:w-10/12 bg-white border rounded hover:shadow"
                                >
                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        type="search"
                                        name="search"
                                        placeholder="Nh???p th??ng tin ????n h??ng"
                                        className="p-2 text-sm outline-none flex-1 rounded-l"
                                    />
                                    <button
                                        type="submit"
                                        className="h-full text-sm px-1 sm:px-4 py-2.5 text-white bg-primary-blue hover:bg-blue-600 rounded-r flex items-center gap-1"
                                    >
                                        <SearchIcon sx={{ fontSize: "22px" }} />
                                        T??m ki???m
                                    </button>
                                </form>
                                {/* <!-- searchbar --> */}

                                {orders && filteredOrders.length === 0 && (
                                    <div className="flex items-center flex-col gap-2 p-8 bg-white">
                                        <img
                                            draggable="false"
                                            src="https://rukminim1.flixcart.com/www/100/100/promos/23/08/2020/c5f14d2a-2431-4a36-b6cb-8b5b5e283d4f.png"
                                            alt="Empty Orders"
                                        />
                                        <span className="text-lg font-medium">
                                            Kh??ng c?? k???t qu???
                                        </span>
                                        <p>Th??? l???i</p>
                                    </div>
                                )}

                                {orders &&
                                    filteredOrders
                                        .map((order) => {
                                            const {
                                                _id,
                                                orderStatus,
                                                orderItems,
                                                createdAt,
                                                deliveredAt,
                                                totalPrice,
                                            } = order;
                                            return (
                                                <Link
                                                    to={`/order_details/${_id}`}
                                                    className="flex p-4 items-start bg-white border rounded gap-2 sm:gap-0 hover:shadow-lg"
                                                >
                                                    {/* <!-- image container --> */}
                                                    <div className="w-full sm:w-32 h-20">
                                                        <img
                                                            draggable="false"
                                                            className="h-full w-full object-contain"
                                                            src={
                                                                orderItems[0]
                                                                    .image || ""
                                                            }
                                                            alt="Product image"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row justify-between w-full">
                                                        <div className="flex flex-col gap-1 overflow-hidden">
                                                            <p className="text-sm">
                                                                M?? ????n h??ng:{" "}
                                                                {_id}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                S??? l?????ng:{" "}
                                                                {
                                                                    orderItems.length
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                T???ng ti???n:
                                                                {formatNumber(
                                                                    totalPrice
                                                                )}{" "}
                                                                VN??
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Tr???ng th??i:
                                                                {(orderStatus ===
                                                                    "" ||
                                                                    orderStatus ===
                                                                        "Cancel") &&
                                                                    "????n h??ng ???? b??? hu???"}
                                                                {orderStatus ===
                                                                    "Processing" &&
                                                                    " ??ang x??? l??"}
                                                                {orderStatus ===
                                                                    "Shipped" &&
                                                                    " ??ang giao h??ng"}
                                                                {orderStatus ===
                                                                    "Delivered" &&
                                                                    " ???? nh???n h??ng"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {orderStatus ===
                                                        "Processing" && (
                                                        <div className="flex items-end">
                                                            <button className="bg-red-500 text-white px-4 py-2.5">
                                                                Hu???
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* <!-- image container --> */}

                                                    {/* <!-- order desc container --> */}

                                                    {/* <!-- order desc container --> */}
                                                </Link>
                                            );
                                        })
                                        .reverse()}
                            </div>
                        )}
                    </div>
                    {/* <!-- orders column --> */}
                </div>
                {/* <!-- row --> */}
            </main>
        </>
    );
};

export default MyOrders;
