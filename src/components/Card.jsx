// ĐỂ LẤY THÔNG TIN TỪ APP TRUYỀN VÀO CARD THÌ
// TRONG DẤU NGOẶC () KHAI BÁO props
// VÍ DỤ: <Card name="Thùy Tiên" />
import React from 'react'

export default function Card() {
  return (
    <>
      <div className="card" style={{ width: "18rem" }}>
        <img src="https://www.google.com/url?sa=i&url=http%3A%2F%2Flangsoncdc.vn%2Farticle%2Fnews%2Fca-c-phuong-pha-p-cai-nghie-n-thuo-c-la-.html&psig=AOvVaw2KOJffs9X37lc_BUAp12SB&ust=1748069857660000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMiwzuqBuY0DFQAAAAAdAAAAABAL" className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the bulk of
            the card’s content.
          </p>
          <a href="#" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>

    </>
  )
}
