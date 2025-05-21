//Trả lời các câu hỏi research ngày 06/05/2025

1. Có objectt B nằm trong object A , detructure object B thì object B có bị referent hay không?

Trả lời: Có! Khi destructure object B từ object A, thì object B vẫn giữ reference đến object gốc bên trong A.
Ví dụ: 
    const a = {
        b: {
            value: 42
        }
    };
    const { b } = a;
    b.value = 99; 
    console.log(a.b.value); -> Ở đây bị thay đổi b, vì b là giá trị của một tham chiếu reference  đến object gốc a.b nên thay đổi b sẽ ảnh hưởng tới a.b.

Cách khắc phụ và tránh: Thường em sẽ dùng thư viện lodash / cloneDeep, không thì chơi theo kiểu structuredClone cũng OK nhưng nó sẽ rơi vào 1 số trường hợp là không copy sâu. Tức là 1 object có chứa tỷ tỷ cái object con , cháu, chắt, chít, ... thì trong dự án hạn chế dùng structuredClone hoặc cloneDeep. 

2. Máy tính không lưu trữ các số thực (như 0.1, 3.14) chính xác như cách chúng ta viết chúng trong hệ thập phân. Thay vào đó, chúng sử dụng hệ nhị phân và một tiêu chuẩn gọi là IEEE 754 để biểu diễn các số này. 

Trả lời: Tức là ngôn ngữ của máy tính là hệ nhị phân chỉ có 0 và 1. Khi có 1 hệ thập phân, ví dụ như số 100 -> Máy sẽ chuyển về hệ nhị phân để phân và trả lại kết quả là hệ thập phân. Nhưng nhiều số trong hệ thập phân kiểu real number (Chẳng hạn như số 0.1 ; 0.2,....) máy sẽ không thể chuyển sang hệ nhị phân một cách chính xác.
Ví dụ: 
    1/3 = 0.3333... (vô tận)
    Trong hệ nhị phân, 0.1 cũng là một số vô tận kiểu: 0.0001100110011... (cứ lặp mãi mãi)
    Máy tính không thể lưu vô tận, nên nó cắt bớt – và gây ra sai số.

Vậy chuẩn IEE 754 đc đẻ ra nhằm quy đinh toàn cầu về cách máy tính lưu trữ và xử lý số thực bằng cách : 
    - Chia số thành 3 phần: dấu, phần mũ, phần trị.

    - Dùng số bit cố định để lưu, ví dụ 32-bit float, 64-bit double.

3. Hiểu gì về type int trong javaScript
Thật ra JS làm gì có khái nhiệm int như trong C# với java. Nó chỉ có Number, tất cả các số dù là số nguyên hay số thập phân – đều là kiểu Number, và theo chuẩn IEEE 754 dạng 64-bit floating point.
Ex: typeof 42;           // "number"
typeof 3.14;         // "number"
typeof -1000;        // "number"

JavaScript lưu số bằng 64-bit float nên:
Có giới hạn trong việc biểu diễn số nguyên chính xác.
Số nguyên an toàn nằm trong khoảng:

Number.MAX_SAFE_INTEGER; // 9007199254740991
Number.MIN_SAFE_INTEGER; // -9007199254740991
Muốn làm việc với số lớn dùng BigInt (Này em research mới biết chứ không thường xài :v )

