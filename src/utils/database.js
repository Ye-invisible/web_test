export const initDataBase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("users.db", 1);

        request.onerror = (e) => {
            console.error("数据库打开失败", e.target.error);
            reject(e.target.error);
        };

        request.onsuccess = (e) => {
            const db = e.target.result;
            console.log("数据库打开成功");
            resolve(db); 
        };

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('users')) {
                const store = db.createObjectStore('users', {
                    keyPath: "id",
                    autoIncrement: true
                });
                store.createIndex('name', 'name', { unique: true });
                store.createIndex('password', 'password', { unique: false });
            }
        };
    });
};

export const addUser = (db, user) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readwrite')
        const store = transaction.objectStore('users')
    
        const request = store.add(user)
    
        request.onsuccess = () => {
            console.log("数据添加成功")
            resolve(true)
        }
    
        request.onerror = (e) => {
            console.log("数据添加失败", e.target.error)
            resolve(false)
        }
    })
}


export const getUser = (db, username) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const index = store.index('name')
        
        const request = index.get(username);
        
        request.onsuccess = (event) => {
          const user = event.target.result;
        //   console.log('获取到客户:', user);
          resolve(user)
        };
        
        request.onerror = (event) => {
          console.error('获取数据失败:', event.target.error);
          reject(e.target.error)
        };
    })
 
}