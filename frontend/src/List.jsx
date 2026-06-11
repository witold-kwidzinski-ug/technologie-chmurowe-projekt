import { useEffect, useState } from 'react';
import ItemAdder from './ItemAdder';



export default function List() {
    const [items, setItems] = useState([])

    useEffect(() => {
    async function fetchItems() {
        const d = await fetch("/api/items").then(o => o.json())
        console.log(d)
        setItems(d)
    }

    fetchItems()

    }, [])

    function convertTextToHEX(text) {
        let hex = "";

        for (let i = 0; i < text.length; i++) {
            hex += text.charCodeAt(i).toString(16);
        }

        // dopasowanie do 6 znaków
        hex = (hex + "000000").slice(0, 6);

        return "#" + hex;
    }

    function invertColor(text) {
        let hex = convertTextToHEX(text)
        hex = hex.replace("#", "");

        const r = 255 - parseInt(hex.slice(0, 2), 16);
        const g = 255 - parseInt(hex.slice(2, 4), 16);
        const b = 255 - parseInt(hex.slice(4, 6), 16);

        return (
            "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0")
        );
    }

    return (
        <>
            <ItemAdder setItems={setItems}></ItemAdder>
            <div id="listgrid">
                {items.map((n, i) => (<p id={`${n.name}${i}`} className='item' style={{backgroundColor: convertTextToHEX(n.name), color: invertColor(n.name)}} >{n.name}</p>))}
            </div>
        </>
    )

}