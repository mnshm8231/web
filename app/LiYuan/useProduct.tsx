import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Product } from "../_settings/interfaces";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function useProducts() {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [restaurants, setRestaurants] = useState<String[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('1');

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const querySnapshop = await getDocs(collection(db, "FuYuan"));
            const restaurantList: string[] = [];
            const menuPromises: any[] = []; //等待異步
            let photo = '鍋貼.jpg';
            for (const shop of querySnapshop.docs) {
                const querySnapshotMenu = await getDocs(collection(db, "FuYuan/" + shop.id + "/menu"));
                restaurantList.push(shop.id);

                for (const menu of querySnapshotMenu.docs) {
                    if (menu.exists()) {
                        photo = menu.data().photo ? menu.data().photo : '鍋貼.jpg';
                    }

                    const starsRef = ref(storage, photo);
                    const photoURL = await getDownloadURL(starsRef);

                    const menuItem = {
                        id: menu.id,
                        desc: menu.data().desc,
                        price: menu.data().price,
                        type: menu.data().type,
                        res_name: menu.data().res_name,
                        photo: photoURL
                    };
                    menuPromises.push(Promise.resolve(menuItem));
                }
            }
            //使用Promise.all等待所有異步操作完成
            Promise.all(menuPromises).then((menuItemsArrays) => {
                // Concatenate all menu items from different shops
                const allMenuItems = menuItemsArrays.flat();
                // Set the products state with all menu items
                setProducts(allMenuItems);
            })
            //});
            setRestaurants(restaurantList);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    //利用子集合menu中的res_name與doc.id一致，找到正確餐廳修改其collection中的資料
    async function addProduct(product: Product, res_name: string) {
        const docRef = await addDoc(collection(db, `FuYuan/${res_name}/menu`),
            { desc: product.desc, price: product.price, type: product.type, res_name: product.res_name });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }

    async function deleteProduct(id: string, res_name: string) {
        try {
            const db = getFirestore(app);
            await deleteDoc(doc(db, `FuYuan/${res_name}/menu`, id));
            setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
            console.error(error);
        }

    }
    async function updateProduct(product: Product, res_name: string) {
        try {
            const db = getFirestore(app);
            await updateDoc(doc(db, `FuYuan/${res_name}/menu`, product.id),
                { desc: product.desc, price: product.price, type: product.type, res_name: product.res_name });
            setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
            console.error(error);
        }

    }

    const handleRestaurantClick = async (event: React.SyntheticEvent, restaurantId: string) => {
        setSelectedRestaurant(restaurantId);
    }

    return { products, addProduct, deleteProduct, updateProduct, handleRestaurantClick, isLoading, restaurants, selectedRestaurant } as const;

}
