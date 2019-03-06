



export class Security {

    static getName(securityItem) {
        if(!securityItem)
            return undefined;

        if(securityItem && securityItem.description){
            //TODO: make mapping of table to stock fields
            const raw = securityItem.description.find(a => a.name ==='NAME');
            if(raw)
                return raw.value;
        }

            
        return securityItem.definition && securityItem.definition.name ? securityItem.definition.name : securityItem.securityId;

    }


    static createStockItem = (id, group, selected = false) => {
        const definition = {
            securityId: id,
            group: group
        };
    
        return {
            securityId: definition.securityId,
            selected: selected,
            definition,
            history: undefined,
            description: undefined,
            price: undefined
        };
    };
    

}