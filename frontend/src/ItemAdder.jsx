import {useState} from "react"

export default function ItemAdder({setItems}) {

    const [name, setName] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        console.log(name)

        async function sendItem() {
            try {
                const res = await fetch("/api/items", {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({name})
                }).then(o => o.json())
                console.log(res)
                setItems(p => [...p, res])            
                setName("")
            } catch {
                console.log("Fetch failed.")
            }
        }

        sendItem()
        
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="itemName" placeholder="Add game" onChange={e => setName(e.target.value)} value={name} />
                <button>Add</button>
            </form>
        </>
    )
}