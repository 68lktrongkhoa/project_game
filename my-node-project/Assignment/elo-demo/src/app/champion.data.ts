
import { Champion, ChampionClass, ChampionAbility } from './champion.model';

export const LEAGUE_OF_LEGENDS_CHAMPIONS: Champion[] = [

  {
    id: 1,
    name: 'Garen',
    title: 'Sức Mạnh Demacia',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Garen_0.jpg',
    description: 'Chiến binh Demacia kiên cường với khả năng phòng thủ và sát thương ổn định.',
    abilities: [
      { name: 'Kiên Nghị (Nội tại)', description: 'Garen hồi phục phần trăm máu tối đa mỗi giây khi không nhận sát thương.' },
      { name: 'Đòn Quyết Định', description: 'Garen tăng tốc chạy, đòn đánh kế tiếp gây thêm sát thương và câm lặng mục tiêu.' },
      { name: 'Dũng Khí', description: 'Garen tăng kháng hiệu ứng và giảm sát thương trong thời gian ngắn.' },
      { name: 'Phán Quyết', description: 'Garen xoay kiếm gây sát thương xung quanh.' },
      { name: 'Công Lý Demacia', description: 'Garen trừng phạt kẻ địch gây sát thương chuẩn dựa trên máu đã mất.' }
    ],
    baseStats: { health: 3500, attackDamage: 170, abilityPower: 0, armor: 100, magicResist: 50, movementSpeed: 380 }
  },
  {
    id: 2,
    name: 'Darius',
    title: 'Tay Đồ Tể Noxus',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg',
    description: 'Chiến binh khát máu với khả năng hồi phục và sát thương cực cao.',
    abilities: [
      { name: 'Xuất Huyết (Nội tại)', description: 'Đòn đánh và kỹ năng gây chảy máu, tích đủ 5 cộng dồn kích hoạt Sức Mạnh Noxus, tăng mạnh sát thương.' },
      { name: 'Tàn Sát', description: 'Darius vung rìu gây sát thương theo vùng, hồi máu khi trúng tướng ở rìa ngoài.' },
      { name: 'Đánh Thọt', description: 'Đòn đánh kế tiếp của Darius gây thêm sát thương và làm chậm kẻ địch.' },
      { name: 'Bắt Giữ', description: 'Darius kéo đối phương về phía mình bằng lưỡi rìu và làm chậm thoáng chốc.' },
      { name: 'Máy Chém Noxus', description: 'Đòn chém chí mạng gây sát thương chuẩn, hồi chiêu nếu hạ gục đối thủ.' }
    ],
    baseStats: { health: 3400, attackDamage: 175, abilityPower: 0, armor: 95, magicResist: 50, movementSpeed: 380 }
  },
  {
    id: 3,
    name: 'Sett',
    title: 'Đại Ca',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Sett_0.jpg',
    description: 'Đấu sĩ cận chiến mạnh mẽ, sẵn sàng lao vào giao tranh và chịu đòn.',
    abilities: [
      { name: 'Trái Tim Võ Đài (Nội tại)', description: 'Đòn đánh tay trái và phải xen kẽ, tay phải nhanh và mạnh hơn. Hồi máu dựa trên máu đã mất.' },
      { name: 'Không Trượt Phát Nào', description: 'Sett tăng tốc độ di chuyển về phía tướng địch, đòn đánh tiếp theo gây thêm sát thương.' },
      { name: 'Cuồng Thú Quyền', description: 'Sett tung hai cú đấm liên tiếp, gây sát thương và tạo lá chắn dựa trên sát thương gánh chịu.' },
      { name: 'Song Thú Chưởng', description: 'Sett kéo kẻ địch ở hai bên lại với nhau, gây sát thương và làm choáng nếu trúng ở cả hai bên.' },
      { name: 'Hủy Diệt Đấu Trường', description: 'Sett tóm một tướng địch, lao về phía trước và nện xuống đất, gây sát thương và làm chậm diện rộng.' }
    ],
    baseStats: { health: 3600, attackDamage: 172, abilityPower: 0, armor: 98, magicResist: 52, movementSpeed: 375 }
  },
  {
    id: 4,
    name: 'Irelia',
    title: 'Vũ Kiếm Sư',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_0.jpg',
    description: 'Đấu sĩ cơ động với khả năng lướt và gây sát thương liên tục bằng những lưỡi kiếm ma thuật.',
    abilities: [
      { name: 'Ý Chí Ionia (Nội tại)', description: 'Tấn công kẻ địch bằng kỹ năng sẽ cộng dồn Ý Chí Ionia. Khi đủ cộng dồn, đòn đánh gây thêm sát thương phép.' },
      { name: 'Đâm Kiếm', description: 'Irelia lướt tới mục tiêu, gây sát thương. Hồi chiêu nếu mục tiêu bị hạ gục hoặc bị đánh dấu.' },
      { name: 'Vũ Điệu Thách Thức', description: 'Irelia vận sức, giảm sát thương gánh chịu rồi phóng ra một luồng kiếm gây sát thương.' },
      { name: 'Bước Nhảy Hoàn Vũ', description: 'Irelia ném hai lưỡi kiếm, gây sát thương và làm choáng kẻ địch bị kẹp giữa.' },
      { name: 'Thanh Kiếm Tiên Phong', description: 'Irelia phóng ra một cơn bão kiếm, gây sát thương và tạo một bức tường kiếm làm chậm và giải giới kẻ địch đi qua.' }
    ],
    baseStats: { health: 3350, attackDamage: 168, abilityPower: 0, armor: 92, magicResist: 48, movementSpeed: 385 }
  },
  {
    id: 5,
    name: 'Jax',
    title: 'Bậc Thầy Vũ Khí',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jax_0.jpg',
    description: 'Đấu sĩ mạnh mẽ về cuối trận với khả năng gây sát thương hỗn hợp và né tránh đòn đánh.',
    abilities: [
      { name: 'Không Khoan Nhượng (Nội tại)', description: 'Đòn đánh thường liên tiếp tăng tốc độ đánh.' },
      { name: 'Nhảy Và Nện', description: 'Jax nhảy tới một đơn vị, gây sát thương nếu là kẻ địch.' },
      { name: 'Vận Sức', description: 'Jax cường hóa đòn đánh tiếp theo gây thêm sát thương phép.' },
      { name: 'Phản Công', description: 'Jax né tránh tất cả đòn đánh thường và giảm sát thương diện rộng trong thời gian ngắn, sau đó làm choáng kẻ địch xung quanh.' },
      { name: 'Sức Mạnh Bậc Thầy', description: 'Nội tại: Mỗi đòn đánh thứ ba gây thêm sát thương phép. Kích hoạt: Tăng giáp và kháng phép trong thời gian ngắn.' }
    ],
    baseStats: { health: 3450, attackDamage: 170, abilityPower: 0, armor: 96, magicResist: 50, movementSpeed: 380 }
  },
  {
    id: 6,
    name: 'Camille',
    title: 'Bóng Thép',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Camille_0.jpg',
    description: 'Đấu sĩ cơ động với khả năng truy đuổi và cô lập mục tiêu hiệu quả.',
    abilities: [
      { name: 'Thích Nghi Phòng Ngự (Nội tại)', description: 'Đòn đánh thường lên tướng cho Camille một lá chắn dựa trên loại sát thương của tướng đó.' },
      { name: 'Giao Thức Chuẩn Xác', description: 'Đòn đánh kế tiếp của Camille gây thêm sát thương và tăng tốc độ di chuyển. Có thể tái kích hoạt để gây sát thương chuẩn.' },
      { name: 'Đá Quét Chiến Thuật', description: 'Camille quét chân theo hình nón, gây sát thương. Kẻ địch trúng ở nửa ngoài bị làm chậm và Camille hồi máu.' },
      { name: 'Bắn Dây Móc', description: 'Camille bắn dây móc vào tường, lướt tới và hất tung kẻ địch nếu trúng tướng.' },
      { name: 'Tối Hậu Thư', description: 'Camille cô lập một tướng địch trong một khu vực, gây thêm sát thương phép lên mục tiêu.' }
    ],
    baseStats: { health: 3300, attackDamage: 165, abilityPower: 0, armor: 90, magicResist: 48, movementSpeed: 385 }
  },
  {
    id: 7,
    name: 'Fiora',
    title: 'Nữ Kiếm Sư',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg',
    description: 'Đấu sĩ tay đôi cực mạnh với khả năng khai thác điểm yếu của đối thủ.',
    abilities: [
      { name: 'Vũ Điệu Kiếm Sư (Nội tại)', description: 'Fiora phát hiện Điểm Yếu trên tướng địch gần đó. Tấn công Điểm Yếu gây sát thương chuẩn và hồi máu.' },
      { name: 'Lao Tới', description: 'Fiora lướt một đoạn ngắn và đâm kiếm vào kẻ địch gần nhất, ưu tiên Điểm Yếu và tướng.' },
      { name: 'Phản Đòn', description: 'Fiora chặn mọi sát thương và hiệu ứng khống chế trong thoáng chốc, rồi đâm kiếm làm chậm (hoặc choáng nếu chặn được hiệu ứng khống chế mạnh).' },
      { name: 'Nhất Kiếm Nhị Dụng', description: 'Fiora tăng tốc độ đánh cho hai đòn kế tiếp. Đòn đầu làm chậm, đòn sau chí mạng.' },
      { name: 'Đại Thử Thách', description: 'Fiora chọn một tướng địch, làm lộ 4 Điểm Yếu. Nếu Fiora phá hủy cả 4 hoặc mục tiêu bị hạ gục, Fiora và đồng minh trong vùng được hồi máu lớn.' }
    ],
    baseStats: { health: 3250, attackDamage: 168, abilityPower: 0, armor: 88, magicResist: 47, movementSpeed: 380 }
  },
  {
    id: 8,
    name: 'Renekton',
    title: 'Đồ Tể Sa Mạc',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Renekton_0.jpg',
    description: 'Đấu sĩ mạnh mẽ đầu trận với khả năng gây sát thương và hồi phục tốt.',
    abilities: [
      { name: 'Đế Chế Cuồng Nộ (Nội tại)', description: 'Renekton tạo Nộ khi tấn công. Khi đủ Nộ, kỹ năng của hắn được cường hóa.' },
      { name: 'Vũ Điệu Cá Sấu', description: 'Renekton xoay vũ khí, gây sát thương và hồi máu. Cường hóa: Sát thương và hồi máu tăng.' },
      { name: 'Kẻ Săn Mồi Tàn Nhẫn', description: 'Đòn đánh kế tiếp của Renekton gây thêm sát thương và làm choáng. Cường hóa: Đánh 3 lần, làm choáng lâu hơn.' },
      { name: 'Cắt Và Xắt', description: 'Renekton lướt tới, gây sát thương. Nếu trúng kẻ địch, có thể tái kích hoạt. Cường hóa: Gây thêm sát thương và giảm giáp.' },
      { name: 'Thần Cá Sấu', description: 'Renekton hóa khổng lồ, tăng máu, gây sát thương phép mỗi giây và liên tục tạo Nộ.' }
    ],
    baseStats: { health: 3480, attackDamage: 173, abilityPower: 0, armor: 97, magicResist: 51, movementSpeed: 378 }
  },

  // --- MAGE (Pháp Sư) ---
  {
    id: 10,
    name: 'Lux',
    title: 'Tiểu Thư Ánh Sáng', // Adjusted title slightly
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg',
    description: 'Pháp sư tầm xa với sát thương phép lớn và khả năng khống chế.',
    abilities: [
      { name: 'Chiếu Rọi (Nội tại)', description: 'Kỹ năng của Lux đánh dấu mục tiêu. Đòn đánh thường hoặc Cầu Vồng Tối Thượng kích hoạt dấu ấn, gây thêm sát thương phép.' },
      { name: 'Khóa Ánh Sáng', description: 'Lux bắn một luồng sáng trói chân tối đa hai mục tiêu và gây sát thương phép.' },
      { name: 'Lăng Kính Phòng Hộ', description: 'Lux ném cây trượng của mình, tạo lá chắn cho bản thân và đồng minh nó chạm phải khi bay đi và bay về.' },
      { name: 'Quả Cầu Ánh Sáng', description: 'Tạo vùng ánh sáng làm chậm và gây sát thương phép. Có thể kích hoạt sớm để nổ.' },
      { name: 'Cầu Vồng Tối Thượng', description: 'Lux tập trung năng lượng bắn tia sáng cực mạnh gây sát thương phép lớn lên tất cả kẻ địch trong vùng.' }
    ],
    baseStats: { health: 3100, mana: 450, attackDamage: 150, abilityPower: 0, armor: 85, magicResist: 50, movementSpeed: 360 }
  },
  {
    id: 11,
    name: 'Syndra',
    title: 'Nữ Chúa Bóng Tối',
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Syndra_0.jpg',
    description: 'Pháp sư sát thương đơn mục tiêu cực mạnh với khả năng điều khiển các quả cầu bóng tối.',
    abilities: [
      { name: 'Siêu Việt (Nội tại)', description: 'Kỹ năng của Syndra được cường hóa khi đạt cấp độ tối đa.' },
      { name: 'Quả Cầu Bóng Tối', description: 'Syndra tạo một Quả Cầu Bóng Tối, gây sát thương phép. Quả cầu tồn tại trong vài giây.' },
      { name: 'Ý Lực', description: 'Syndra nhặt và ném một Quả Cầu Bóng Tối hoặc lính địch, gây sát thương phép và làm chậm.' },
      { name: 'Quét Tan Kẻ Yếu', description: 'Syndra đẩy lùi kẻ địch và Quả Cầu Bóng Tối, gây sát thương phép. Quả Cầu bị đẩy lùi sẽ làm choáng.' },
      { name: 'Bùng Nổ Sức Mạnh', description: 'Syndra phóng tất cả Quả Cầu Bóng Tối đang có vào một tướng địch, mỗi quả cầu gây sát thương phép.' }
    ],
    baseStats: { health: 3050, mana: 460, attackDamage: 148, abilityPower: 0, armor: 82, magicResist: 50, movementSpeed: 355 }
  },
  {
    id: 12,
    name: 'Ahri',
    title: 'Hồ Ly Chín Đuôi',
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
    description: 'Pháp sư cơ động với khả năng dồn sát thương và quyến rũ mục tiêu.',
    abilities: [
      { name: 'Hút Hồn (Nội tại)', description: 'Khi Ahri trúng tướng địch bằng kỹ năng, cô nhận một cộng dồn. Đủ cộng dồn, kỹ năng kế tiếp hồi máu cho Ahri.' },
      { name: 'Quả Cầu Ma Thuật', description: 'Ahri ném quả cầu gây sát thương phép khi bay đi và sát thương chuẩn khi bay về.' },
      { name: 'Lửa Hồ Ly', description: 'Ahri triệu hồi ba ngọn lửa hồ ly tự động tìm kiếm và tấn công kẻ địch gần đó.' },
      { name: 'Hôn Gió', description: 'Ahri hôn gió, gây sát thương phép và mê hoặc mục tiêu đầu tiên trúng phải, khiến chúng di chuyển vô hại về phía cô.' },
      { name: 'Phi Hồ', description: 'Ahri lướt tới phía trước và bắn ra các tia năng lượng gây sát thương phép vào kẻ địch gần đó. Có thể tái kích hoạt 2 lần nữa.' }
    ],
    baseStats: { health: 3150, mana: 440, attackDamage: 152, abilityPower: 0, armor: 84, magicResist: 50, movementSpeed: 365 }
  },
  {
    id: 13,
    name: 'Veigar',
    title: 'Bậc Thầy Tiểu Quỷ',
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Veigar_0.jpg',
    description: 'Pháp sư có khả năng gia tăng sức mạnh phép thuật vô hạn, gây sát thương cực lớn vào cuối trận.',
    abilities: [
      { name: 'Sức Mạnh Quỷ Quyệt (Nội tại)', description: 'Đánh trúng tướng địch bằng kỹ năng hoặc hạ gục mục tiêu giúp Veigar tăng vĩnh viễn Sức Mạnh Phép Thuật.' },
      { name: 'Điềm Gở', description: 'Veigar bắn một tia năng lượng gây sát thương phép lên hai kẻ địch đầu tiên trúng phải.' },
      { name: 'Thiên Thạch Đen', description: 'Veigar gọi một khối vật chất tối từ trên trời rơi xuống, gây sát thương phép.' },
      { name: 'Bẻ Cong Không Gian', description: 'Veigar tạo một lồng ma thuật làm choáng kẻ địch chạm vào vành của nó.' },
      { name: 'Vụ Nổ Vũ Trụ', description: 'Veigar tung một vụ nổ năng lượng vào tướng địch, gây sát thương phép dựa trên máu đã mất của mục tiêu.' }
    ],
    baseStats: { health: 3000, mana: 480, attackDamage: 145, abilityPower: 0, armor: 80, magicResist: 50, movementSpeed: 350 }
  },
  {
    id: 14,
    name: 'Annie',
    title: 'Đứa Trẻ Bóng Tối',
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Annie_0.jpg',
    description: 'Pháp sư dồn sát thương mạnh mẽ với khả năng triệu hồi gấu Tibbers khổng lồ.',
    abilities: [
      { name: 'Hỏa Cuồng (Nội tại)', description: 'Sau khi sử dụng 4 kỹ năng, kỹ năng tấn công kế tiếp của Annie sẽ làm choáng mục tiêu.' },
      { name: 'Hỏa Cầu', description: 'Annie ném một quả cầu lửa gây sát thương phép. Nếu hạ gục mục tiêu, hoàn trả năng lượng và giảm nửa thời gian hồi chiêu.' },
      { name: 'Thiêu Cháy', description: 'Annie phun lửa hình nón, gây sát thương phép lên tất cả kẻ địch trong vùng.' },
      { name: 'Khiên Lửa', description: 'Annie tạo lá chắn lửa cho bản thân hoặc đồng minh, tăng tốc độ di chuyển và gây sát thương phép lên kẻ địch tấn công lá chắn.' },
      { name: 'Triệu Hồi: Tibbers', description: 'Annie triệu hồi gấu Tibbers, gây sát thương phép khi xuất hiện. Tibbers tấn công và đốt cháy kẻ địch xung quanh.' }
    ],
    baseStats: { health: 3120, mana: 430, attackDamage: 148, abilityPower: 0, armor: 83, magicResist: 50, movementSpeed: 355 }
  },
  {
    id: 15,
    name: 'Orianna',
    title: 'Quý Cô Dây Cót',
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Orianna_0.jpg',
    description: 'Pháp sư điều khiển một quả cầu cơ khí, gây sát thương và cung cấp tiện ích cho đồng đội.',
    abilities: [
      { name: 'Lên Dây Cót (Nội tại)', description: 'Đòn đánh của Orianna gây thêm sát thương phép. Sát thương này tăng lên nếu tấn công cùng mục tiêu liên tiếp.' },
      { name: 'Lệnh: Tấn Công', description: 'Orianna điều khiển Quả Cầu di chuyển đến vị trí chỉ định, gây sát thương phép cho kẻ địch trên đường bay và tại điểm đến.' },
      { name: 'Lệnh: Phát Sóng', description: 'Orianna điều khiển Quả Cầu phát ra một xung điện, gây sát thương phép cho kẻ địch xung quanh và tăng/giảm tốc độ di chuyển.' },
      { name: 'Lệnh: Bảo Vệ', description: 'Orianna điều khiển Quả Cầu gắn vào một đồng minh, tạo lá chắn và gây sát thương cho kẻ địch nó chạm phải trên đường bay.' },
      { name: 'Lệnh: Sóng Âm', description: 'Orianna điều khiển Quả Cầu phát ra một sóng xung kích, gây sát thương và hất tung kẻ địch lại gần Quả Cầu.' }
    ],
    baseStats: { health: 3080, mana: 460, attackDamage: 146, abilityPower: 0, armor: 81, magicResist: 50, movementSpeed: 350 }
  },
  {
    id: 16,
    name: 'Viktor',
    title: 'Sứ Giả Máy Móc',
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Viktor_0.jpg',
    description: 'Pháp sư kiểm soát vùng và gây sát thương theo thời gian, có khả năng nâng cấp kỹ năng.',
    abilities: [
      { name: 'Tiến Hóa Huy Hoàng (Nội tại)', description: 'Viktor bắt đầu với một Lõi Công Nghệ Hex, có thể nâng cấp 3 lần để cường hóa các kỹ năng cơ bản.' },
      { name: 'Chuyển Hóa Năng Lượng', description: 'Viktor bắn một tia năng lượng vào kẻ địch, gây sát thương phép, tạo lá chắn và cường hóa đòn đánh tiếp theo. Nâng cấp: Lá chắn mạnh hơn và Viktor nhận thêm tốc độ di chuyển.' },
      { name: 'Trường Trọng Lực', description: 'Viktor tạo ra một trường trọng lực làm chậm kẻ địch. Kẻ địch ở trong trường quá lâu sẽ bị choáng. Nâng cấp: Kỹ năng làm choáng ở tâm ngay lập tức.' },
      { name: 'Tia Chết Chóc', description: 'Viktor phóng một tia la-ze theo đường thẳng, gây sát thương phép. Nâng cấp: Tia la-ze phát nổ sau đó, gây thêm sát thương.' },
      { name: 'Bão Điện Từ', description: 'Viktor tạo ra một cơn bão điện từ gây sát thương phép liên tục và ngắt quãng niệm chú của kẻ địch. Bão sẽ đuổi theo mục tiêu. Nâng cấp: Bão di chuyển nhanh hơn.' }
    ],
    baseStats: { health: 3150, mana: 470, attackDamage: 150, abilityPower: 0, armor: 84, magicResist: 50, movementSpeed: 360 }
  },
  {
    id: 17,
    name: 'Xerath',
    title: 'Pháp Sư Thăng Hoa',
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Xerath_0.jpg',
    description: 'Pháp sư pháo binh tầm cực xa, có khả năng cấu rỉa và gây sát thương từ khoảng cách an toàn.',
    abilities: [
      { name: 'Nguồn Năng Lượng (Nội tại)', description: 'Đòn đánh thường của Xerath hồi năng lượng theo chu kỳ.' },
      { name: 'Xung Kích Năng Lượng', description: 'Xerath vận sức rồi bắn một luồng năng lượng tầm xa, gây sát thương phép. Tầm và sát thương tăng theo thời gian vận sức.' },
      { name: 'Vụ Nổ Năng Lượng', description: 'Xerath gọi một vụ nổ năng lượng tại vị trí mục tiêu, gây sát thương phép và làm chậm kẻ địch.' },
      { name: 'Điện Tích Cầu', description: 'Xerath bắn một quả cầu năng lượng, gây sát thương phép và làm choáng mục tiêu đầu tiên trúng phải. Thời gian choáng tăng theo khoảng cách bay.' },
      { name: 'Nghi Thức Ma Pháp', description: 'Xerath đứng yên và bắn tối đa 3 (hoặc nhiều hơn nếu nâng cấp) loạt pháo năng lượng tầm cực xa, gây sát thương phép diện rộng.' }
    ],
    baseStats: { health: 3020, mana: 490, attackDamage: 147, abilityPower: 0, armor: 79, magicResist: 50, movementSpeed: 350 }
  },

  // --- ASSASSIN (Sát Thủ) ---
  {
    id: 20,
    name: 'Zed',
    title: 'Chúa Tể Bóng Tối',
    championClass: ChampionClass.ASSASSIN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg',
    description: 'Sát thủ cơ động với khả năng ám sát cực nhanh bằng bóng tối.',
    abilities: [
      { name: 'Khinh Thường Kẻ Yếu (Nội tại)', description: 'Đòn đánh thường của Zed lên mục tiêu thấp máu gây thêm sát thương phép. Hiệu ứng này có thời gian hồi trên mỗi mục tiêu.' },
      { name: 'Phi Tiêu Sắc Lẻm', description: 'Zed và bóng của hắn ném phi tiêu, gây sát thương lên kẻ địch đầu tiên trúng phải và giảm dần cho các mục tiêu sau.' },
      { name: 'Phân Thân Bóng Tối', description: 'Zed tạo một phân thân tại vị trí chỉ định. Tái kích hoạt để đổi vị trí với phân thân. Phân thân bắt chước kỹ năng của Zed.' },
      { name: 'Đường Kiếm Bóng Tối', description: 'Zed và bóng của hắn xoay kiếm, gây sát thương và làm chậm kẻ địch. Mỗi kẻ địch trúng kỹ năng của Zed sẽ giảm hồi chiêu Phân Thân Bóng Tối.' },
      { name: 'Dấu Ấn Tử Thần', description: 'Zed không thể bị chọn làm mục tiêu và lao tới một tướng địch, đánh dấu chúng. Sau một thời gian ngắn, dấu ấn phát nổ, gây sát thương dựa trên lượng sát thương Zed đã gây ra khi mục tiêu bị đánh dấu.' }
    ],
    baseStats: { health: 3200, attackDamage: 165, abilityPower: 0, armor: 90, magicResist: 50, movementSpeed: 390 }
  },
  {
    id: 21,
    name: 'Akali',
    title: 'Sát Thủ Đơn Độc',
    championClass: ChampionClass.ASSASSIN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_0.jpg',
    description: 'Sát thủ với độ cơ động cao và khả năng tàng hình trong làn khói.',
    abilities: [
      { name: 'Dấu Ấn Sát Thủ (Nội tại)', description: 'Sử dụng kỹ năng lên tướng địch tạo một vòng tròn quanh chúng. Rời khỏi vòng tròn cường hóa đòn đánh tiếp theo của Akali, tăng tầm và sát thương.' },
      { name: 'Phi Đao Năm Cánh', description: 'Akali ném ra năm phi đao theo hình nón, gây sát thương và làm chậm ở tầm tối đa.' },
      { name: 'Bom Khói', description: 'Akali tạo một đám mây khói khiến cô trở nên vô hình và tăng tốc độ di chuyển. Tấn công hoặc dùng kỹ năng sẽ hiện hình thoáng chốc.' },
      { name: 'Phóng Phi Tiêu', description: 'Akali lộn ngược về sau và ném phi tiêu ra phía trước, gây sát thương và đánh dấu mục tiêu đầu tiên trúng phải. Tái kích hoạt để lướt tới mục tiêu bị đánh dấu.' },
      { name: 'Sát Chiêu Hoàn Hảo', description: 'Akali lướt tới, gây sát thương lên kẻ địch trên đường. Tái kích hoạt để lướt lần nữa, gây sát thương dựa trên máu đã mất của mục tiêu.' }
    ],
    baseStats: { health: 3180, attackDamage: 162, abilityPower: 0, armor: 88, magicResist: 50, movementSpeed: 390 }
  },
  {
    id: 22,
    name: 'Katarina',
    title: 'Ác Kiếm',
    championClass: ChampionClass.ASSASSIN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Katarina_0.jpg',
    description: 'Sát thủ phép thuật với khả năng dọn dẹp giao tranh nhờ việc hồi chiêu khi hạ gục.',
    abilities: [
      { name: 'Tham Lam (Nội tại)', description: 'Nếu một tướng địch bị Katarina gây sát thương chết trong vòng 3 giây gần đây, các kỹ năng của cô được giảm mạnh thời gian hồi chiêu.' },
      { name: 'Phi Dao', description: 'Katarina ném một con dao, nảy giữa các kẻ địch rồi rơi xuống đất. Nhặt dao sẽ gây sát thương phép xoay tròn.' },
      { name: 'Chuẩn Bị', description: 'Katarina tung một con dao lên không và tăng tốc độ di chuyển trong thoáng chốc.' },
      { name: 'Ám Sát', description: 'Katarina dịch chuyển đến mục tiêu (kẻ địch, đồng minh hoặc dao), gây sát thương nếu là kẻ địch. Nhặt dao sẽ giảm hồi chiêu Ám Sát.' },
      { name: 'Bông Sen Tử Thần', description: 'Katarina xoay tròn, ném vô số dao vào tối đa 3 tướng địch gần nhất, gây sát thương phép lớn và giảm hồi máu.' }
    ],
    baseStats: { health: 3220, attackDamage: 158, abilityPower: 0, armor: 86, magicResist: 50, movementSpeed: 385 }
  },
  {
    id: 23,
    name: 'Talon',
    title: 'Sát Thủ Bóng Đêm',
    championClass: ChampionClass.ASSASSIN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Talon_0.jpg',
    description: 'Sát thủ vật lý với khả năng di chuyển vượt địa hình và dồn sát thương nhanh chóng.',
    abilities: [
      { name: 'Lưỡi Dao Kết Liễu (Nội tại)', description: 'Kỹ năng của Talon làm bị thương tướng và quái to. Tấn công mục tiêu bị thương 3 lần sẽ khiến chúng chảy máu, gây sát thương lớn theo thời gian.' },
      { name: 'Ngoại Giao Noxus', description: 'Talon đâm mục tiêu. Nếu ở tầm cận chiến, đòn đánh này chí mạng. Nếu ở tầm xa, Talon lao tới và đâm.' },
      { name: 'Ám Khí', description: 'Talon phóng ra một loạt dao găm theo hình nón rồi thu về, gây sát thương hai lần và làm chậm.' },
      { name: 'Con Đường Sát Thủ', description: 'Talon nhảy qua công trình hoặc địa hình gần nhất. Có thời gian hồi trên mỗi đoạn địa hình.' },
      { name: 'Sát Thủ Vô Hình', description: 'Talon phóng ra một vòng lưỡi dao, trở nên vô hình và tăng tốc độ di chuyển. Khi Talon hiện hình, các lưỡi dao hội tụ về vị trí của hắn, gây sát thương lần nữa.' }
    ],
    baseStats: { health: 3250, attackDamage: 168, abilityPower: 0, armor: 92, magicResist: 50, movementSpeed: 380 }
  },
  {
    id: 24,
    name: 'Fizz',
    title: 'Chú Cá Tinh Nghịch',
    championClass: ChampionClass.ASSASSIN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fizz_0.jpg',
    description: 'Sát thủ phép thuật cơ động, có khả năng né tránh sát thương và ám sát mục tiêu yếu máu.',
    abilities: [
      { name: 'Chiến Binh Lanh Lợi (Nội tại)', description: 'Fizz có thể đi xuyên vật thể và nhận ít sát thương hơn từ đòn đánh thường.' },
      { name: 'Đâm Lao', description: 'Fizz lướt qua mục tiêu, gây sát thương phép và áp dụng hiệu ứng đòn đánh.' },
      { name: 'Đinh Ba Hải Thạch', description: 'Nội tại: Đòn đánh của Fizz gây thêm sát thương phép theo thời gian. Kích hoạt: Đòn đánh tiếp theo của Fizz gây thêm sát thương phép lớn, nếu mục tiêu chết, hồi năng lượng và giảm hồi chiêu.' },
      { name: 'Tung Tăng / Nhảy Múa', description: 'Fizz nhảy lên đinh ba, trở nên không thể bị chọn làm mục tiêu. Tái kích hoạt để đáp xuống, gây sát thương phép và làm chậm. Nếu không tái kích hoạt, Fizz sẽ đáp xuống gây sát thương mạnh hơn trong vùng lớn hơn.' },
      { name: 'Triệu Hồi Thủy Quái', description: 'Fizz ném một con cá dính vào tướng địch, làm chậm chúng. Sau một thời gian, một con cá mập khổng lồ trồi lên, hất tung và gây sát thương phép lớn.' }
    ],
    baseStats: { health: 3190, attackDamage: 160, abilityPower: 0, armor: 87, magicResist: 50, movementSpeed: 380 }
  },
  {
    id: 25,
    name: 'Kha\'Zix',
    title: 'Sát Thủ Hư Không',
    championClass: ChampionClass.ASSASSIN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Khazix_0.jpg',
    description: 'Sát thủ thích nghi, có khả năng tiến hóa kỹ năng để đối phó với mối đe dọa.',
    abilities: [
      { name: 'Hiểm Họa Tiềm Tàng (Nội tại)', description: 'Kha\'Zix đánh dấu kẻ địch bị Cô Lập. Kỹ năng và đòn đánh lên mục tiêu Cô Lập được cường hóa.' },
      { name: 'Nếm Mùi Sợ Hãi', description: 'Gây sát thương vật lý lên một mục tiêu. Nếu mục tiêu bị Cô Lập, sát thương tăng mạnh. Tiến hóa Vuốt Kiếm To Xác: Tăng tầm đánh và tầm của Nếm Mùi Sợ Hãi, hồi chiêu nếu mục tiêu bị Cô Lập.' },
      { name: 'Gai Hư Không', description: 'Kha\'Zix bắn gai nổ tung, gây sát thương và hồi máu nếu Kha\'Zix đứng trong vùng nổ. Tiến hóa Gai Liên Hoàn: Bắn 3 loạt gai và làm chậm.' },
      { name: 'Nhảy', description: 'Kha\'Zix nhảy tới một khu vực, gây sát thương khi đáp. Tiến hóa Đôi Cánh: Tăng tầm Nhảy và hồi chiêu khi hạ gục hoặc hỗ trợ hạ gục tướng.' },
      { name: 'Đột Kích Hư Không', description: 'Nội tại: Cho phép Kha\'Zix tiến hóa một kỹ năng. Kích hoạt: Trở nên Vô Hình và tăng tốc độ di chuyển. Có thể tái kích hoạt. Tiến hóa Ngụy Trang Chủ Động: Cho phép sử dụng Đột Kích Hư Không 3 lần và tăng thời gian Vô Hình.' }
    ],
    baseStats: { health: 3230, attackDamage: 166, abilityPower: 0, armor: 91, magicResist: 50, movementSpeed: 385 }
  },
  {
    id: 26,
    name: 'LeBlanc',
    title: 'Kẻ Lừa Đảo',
    championClass: ChampionClass.ASSASSIN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Leblanc_0.jpg',
    description: 'Pháp sư sát thủ với khả năng lừa dối và dồn sát thương cực nhanh.',
    abilities: [
      { name: 'Ảnh Mờ (Nội tại)', description: 'Khi LeBlanc còn dưới 40% máu, cô trở nên vô hình trong thoáng chốc và tạo ra một Ảnh Mờ không gây sát thương. Ảnh Mờ tồn tại trong vài giây.' },
      { name: 'Ấn Ác Ý', description: 'LeBlanc phóng một ấn ký gây sát thương phép. Nếu mục tiêu bị đánh dấu bởi Ấn Ác Ý trúng một kỹ năng khác của LeBlanc, ấn ký sẽ phát nổ gây thêm sát thương.' },
      { name: 'Biến Ảnh', description: 'LeBlanc lướt tới một vị trí, gây sát thương phép cho kẻ địch gần điểm đến. Tái kích hoạt trong vài giây để quay lại vị trí ban đầu.' },
      { name: 'Sợi Xích Siêu Phàm', description: 'LeBlanc ném một sợi xích, nếu trúng kẻ địch sẽ gây sát thương phép và trói chân nếu chúng vẫn ở gần LeBlanc sau một thời gian ngắn.' },
      { name: 'Mô Phỏng', description: 'LeBlanc sử dụng phiên bản mô phỏng của kỹ năng cô vừa dùng, gây sát thương cao hơn.' }
    ],
    baseStats: { health: 3100, mana: 420, attackDamage: 153, abilityPower: 0, armor: 83, magicResist: 50, movementSpeed: 380 }
  },

  // --- TANK (Đỡ Đòn) ---
  {
    id: 30,
    name: 'Malphite',
    title: 'Mảnh Vỡ Monolith',
    championClass: ChampionClass.TANK,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malphite_0.jpg',
    description: 'Tank cứng cáp với khả năng khống chế nhóm mạnh mẽ.',
    abilities: [
      { name: 'Giáp Hoa Cương (Nội tại)', description: 'Malphite nhận một lớp khiên đá hấp thụ sát thương bằng một phần máu tối đa của hắn. Khiên sẽ hồi lại sau khi không nhận sát thương trong vài giây.' },
      { name: 'Mảnh Vỡ Địa Chấn', description: 'Malphite ném một mảnh đá vào kẻ địch, gây sát thương phép, làm chậm và cướp một phần tốc độ di chuyển của chúng.' },
      { name: 'Nắm Đấm Dung Nham', description: 'Nội tại: Malphite tăng giáp. Kích hoạt: Đòn đánh của Malphite gây thêm sát thương lan trong một khoảng thời gian ngắn.' },
      { name: 'Dậm Đất', description: 'Malphite đập mạnh xuống đất, gây sát thương phép lên kẻ địch xung quanh và giảm tốc độ đánh của chúng.' },
      { name: 'Không Thể Cản Phá', description: 'Malphite lao tới vị trí mục tiêu với tốc độ kinh hoàng, gây sát thương phép và hất tung tất cả kẻ địch trong vùng ảnh hưởng.' }
    ],
    baseStats: { health: 3800, attackDamage: 160, abilityPower: 0, armor: 120, magicResist: 50, movementSpeed: 370 }
  },
  {
    id: 31,
    name: 'Ornn',
    title: 'Ngọn Lửa Khởi Nguyên',
    championClass: ChampionClass.TANK,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ornn_0.jpg',
    description: 'Tank đa năng với khả năng rèn trang bị và khống chế diện rộng mạnh mẽ.',
    abilities: [
      { name: 'Thợ Rèn Hắc Ám (Nội tại)', description: 'Ornn có thể tự rèn trang bị không tiêu hao ở bất kỳ đâu. Đồng minh có thể mua các trang bị nâng cấp đặc biệt từ Ornn.' },
      { name: 'Núi Lửa Phun Trào', description: 'Ornn đập đất, tạo một khe nứt gây sát thương và làm chậm. Sau một khoảng trễ, một cột dung nham trồi lên ở cuối khe nứt.' },
      { name: 'Thổi Bễ', description: 'Ornn thở ra lửa, gây sát thương phép và khiến kẻ địch trở nên Giòn. Đòn đánh thường lên mục tiêu Giòn sẽ đẩy lùi chúng và gây thêm sát thương.' },
      { name: 'Xung Kích Bỏng Cháy', description: 'Ornn lao tới, gây sát thương. Nếu va phải địa hình, tạo sóng xung kích hất tung kẻ địch.' },
      { name: 'Hỏa Dương Hiệu Triệu', description: 'Ornn triệu hồi một con Hỏa Tinh Linh khổng lồ lao về phía mình. Tái kích hoạt để Ornn húc vào Hỏa Tinh Linh, đổi hướng nó và hất tung, làm Giòn kẻ địch trúng phải.' }
    ],
    baseStats: { health: 3850, mana: 340, attackDamage: 162, abilityPower: 0, armor: 125, magicResist: 55, movementSpeed: 365 }
  },
  {
    id: 32,
    name: 'Nautilus',
    title: 'Khổng Lồ Biển Sâu',
    championClass: ChampionClass.TANK,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Nautilus_0.jpg',
    description: 'Tank khống chế cực mạnh với khả năng mở giao tranh và bảo vệ đồng đội.',
    abilities: [
      { name: 'Mỏ Neo Ngàn Cân (Nội tại)', description: 'Đòn đánh thường đầu tiên của Nautilus lên mục tiêu sẽ gây thêm sát thương và trói chân chúng trong thoáng chốc.' },
      { name: 'Phóng Mỏ Neo', description: 'Nautilus phóng mỏ neo, kéo bản thân và mục tiêu lại gần nhau, gây sát thương phép.' },
      { name: 'Cơn Giận Của Người Khổng Lồ', description: 'Nautilus tạo một lớp khiên tạm thời. Khi khiên còn tồn tại, đòn đánh của Nautilus gây sát thương phép theo thời gian lên kẻ địch xung quanh.' },
      { name: 'Thủy Triều Dữ Dội', description: 'Nautilus dậm xuống đất, tạo ba đợt sóng nổ xung quanh, gây sát thương phép và làm chậm kẻ địch.' },
      { name: 'Thủy Lôi Tầm Nhiệt', description: 'Nautilus bắn một quả thủy lôi đuổi theo tướng địch, gây sát thương, hất tung và làm choáng mục tiêu chính cùng những kẻ địch trên đường bay.' }
    ],
    baseStats: { health: 3750, mana: 400, attackDamage: 165, abilityPower: 0, armor: 118, magicResist: 52, movementSpeed: 360 }
  },
  {
    id: 33,
    name: 'Leona',
    title: 'Bình Minh Rực Rỡ',
    championClass: ChampionClass.TANK, // Often played Support, but fundamentally a Tank
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Leona_0.jpg',
    description: 'Tank tiên phong với bộ kỹ năng khống chế dồi dào, chuyên mở giao tranh.',
    abilities: [
      { name: 'Ánh Sáng Mặt Trời (Nội tại)', description: 'Kỹ năng của Leona đánh dấu kẻ địch bằng Ánh Sáng Mặt Trời. Đồng minh tấn công mục tiêu bị đánh dấu sẽ tiêu thụ dấu ấn, gây thêm sát thương phép.' },
      { name: 'Khiên Mặt Trời', description: 'Leona cường hóa khiên, đòn đánh kế tiếp gây thêm sát thương phép và làm choáng mục tiêu.' },
      { name: 'Nhật Thực', description: 'Leona nâng khiên, nhận thêm giáp, kháng phép và giảm sát thương. Khi hiệu ứng kết thúc, Leona gây sát thương phép lên kẻ địch xung quanh.' },
      { name: 'Thiên Đỉnh Kiếm', description: 'Leona phóng ra một hình ảnh mặt trời, gây sát thương phép. Nếu trúng tướng địch, Leona lao tới và trói chân chúng.' },
      { name: 'Thái Dương Hạ San', description: 'Leona gọi một luồng năng lượng mặt trời xuống, gây sát thương và làm chậm. Kẻ địch ở trung tâm vùng ảnh hưởng bị làm choáng.' }
    ],
    baseStats: { health: 3700, mana: 380, attackDamage: 158, abilityPower: 0, armor: 115, magicResist: 53, movementSpeed: 365 }
  },
  {
    id: 34,
    name: 'Shen',
    title: 'Mắt Hoàng Hôn',
    championClass: ChampionClass.TANK,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shen_0.jpg',
    description: 'Tank bảo hộ với khả năng che chắn đồng đội và can thiệp giao tranh toàn bản đồ.',
    abilities: [
      { name: 'Lá Chắn Kiếm Khí (Nội tại)', description: 'Sau khi sử dụng một kỹ năng, Shen nhận một lá chắn.' },
      { name: 'Công Kích Hoàng Hôn', description: 'Shen gọi Kiếm Hồn về phía mình. Đòn đánh kế tiếp của Shen được cường hóa, gây thêm sát thương phép dựa trên máu tối đa của mục tiêu. Nếu Kiếm Hồn đi qua tướng địch, đòn đánh được cường hóa mạnh hơn và làm chậm chúng.' },
      { name: 'Bảo Hộ Hồn Giáp', description: 'Shen tạo một vùng bảo hộ quanh Kiếm Hồn, chặn tất cả đòn đánh thường của kẻ địch trong vùng.' },
      { name: 'Vô Ảnh Bộ', description: 'Shen lướt tới một hướng, gây sát thương và khiêu khích tướng địch trúng phải.' },
      { name: 'Nhất Thống', description: 'Shen vận sức rồi dịch chuyển đến một tướng đồng minh ở bất kỳ đâu trên bản đồ, tạo cho họ một lá chắn lớn.' }
    ],
    baseStats: { health: 3780, attackDamage: 163, abilityPower: 0, armor: 119, magicResist: 54, movementSpeed: 370 }
  },
  {
    id: 35,
    name: 'Sion',
    title: 'Chiến Binh Bất Tử',
    championClass: ChampionClass.TANK,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Sion_0.jpg',
    description: 'Tank khổng lồ với khả năng hồi sinh sau khi chết và chiêu cuối mở giao tranh mạnh mẽ.',
    abilities: [
      { name: 'Vinh Quang Tử Sĩ (Nội tại)', description: 'Sau khi chết, Sion hồi sinh tạm thời với máu suy giảm nhanh chóng, có thể di chuyển và tấn công nhưng không dùng kỹ năng. Đòn đánh của hắn gây thêm sát thương và hút máu.' },
      { name: 'Cú Nện Tàn Khốc', description: 'Sion vận sức rồi đập rìu xuống đất, gây sát thương và hất tung kẻ địch. Thời gian vận càng lâu, sát thương và thời gian hất tung càng lớn.' },
      { name: 'Lò Luyện Hồn', description: 'Nội tại: Sion tăng máu tối đa khi hạ gục lính hoặc quái. Kích hoạt: Sion tạo lá chắn. Sau một thời gian, nếu lá chắn không bị phá, Sion có thể tái kích hoạt để gây sát thương phép.' },
      { name: 'Sát Nhân Hống', description: 'Sion hét lớn, gây sát thương phép, làm chậm và giảm giáp mục tiêu đầu tiên trúng phải. Nếu mục tiêu không phải tướng, nó bị đẩy lùi.' },
      { name: 'Bất Khả Kháng Cự', description: 'Sion lao về phía trước với tốc độ tăng dần, không thể bị cản phá. Hắn dừng lại khi va phải tướng địch hoặc địa hình, gây sát thương và hất tung kẻ địch trong vùng.' }
    ],
    baseStats: { health: 3900, mana: 350, attackDamage: 168, abilityPower: 0, armor: 122, magicResist: 53, movementSpeed: 370 }
  },
  {
    id: 36,
    name: 'Maokai',
    title: 'Ma Cây Vặn Vẹo',
    championClass: ChampionClass.TANK,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Maokai_0.jpg',
    description: 'Tank kiểm soát với khả năng hồi phục, khống chế và tạo chồi non gây sát thương.',
    abilities: [
      { name: 'Ma Pháp Nhựa Cây (Nội tại)', description: 'Mỗi khi một kỹ năng được sử dụng gần Maokai, hắn nhận một cộng dồn. Đủ cộng dồn, đòn đánh thường kế tiếp của Maokai hồi máu cho hắn.' },
      { name: 'Bụi Cây Công Kích', description: 'Maokai đấm xuống đất, phóng một luồng sóng xung kích gây sát thương phép và làm chậm kẻ địch, hất lùi những kẻ địch ở gần.' },
      { name: 'Phi Thân Biến Dị', description: 'Maokai hóa thành một đám rễ cây di chuyển, trở nên không thể bị chọn làm mục tiêu rồi trói chân mục tiêu, gây sát thương phép.' },
      { name: 'Ném Chồi Non', description: 'Maokai ném một chồi non, nó sẽ tồn tại và tấn công kẻ địch đến gần, gây sát thương phép và làm chậm. Chồi non ném vào bụi cỏ tồn tại lâu hơn và gây thêm sát thương.' },
      { name: 'Quyền Lực Thiên Nhiên', description: 'Maokai triệu hồi một bức tường rễ cây khổng lồ từ từ tiến về phía trước, trói chân và gây sát thương phép lên những kẻ địch đầu tiên nó chạm phải.' }
    ],
    baseStats: { health: 3820, mana: 410, attackDamage: 160, abilityPower: 0, armor: 120, magicResist: 55, movementSpeed: 365 }
  },

  // --- MARKSMAN (Xạ Thủ) ---
  {
    id: 40,
    name: 'Ashe',
    title: 'Cung Băng', // Adjusted title
    championClass: ChampionClass.MARKSMAN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ashe_0.jpg',
    description: 'Xạ thủ tầm xa với khả năng khống chế và hỗ trợ đồng đội.',
    abilities: [
      { name: 'Băng Tiễn (Nội tại)', description: 'Đòn đánh của Ashe làm chậm mục tiêu và gây thêm sát thương lên mục tiêu bị làm chậm. Đòn chí mạng của Ashe không gây thêm sát thương mà tăng cường hiệu ứng làm chậm.' },
      { name: 'Chú Tâm Tiễn', description: 'Nội tại: Tích trữ điểm Chú Tâm khi tấn công. Kích hoạt: Ashe tăng mạnh tốc độ đánh và bắn ra một loạt tên trong thời gian ngắn, mỗi mũi tên gây sát thương.' },
      { name: 'Tán Xạ Tiễn', description: 'Ashe bắn ra một loạt 9 mũi tên theo hình nón, gây sát thương và áp dụng hiệu ứng Băng Tiễn.' },
      { name: 'Ưng Tiễn', description: 'Ashe cử một linh hồn chim ưng đi do thám, soi sáng đường bay và một vùng rộng lớn khi đến đích.' },
      { name: 'Đại Băng Tiễn', description: 'Ashe bắn một mũi tên pha lê khổng lồ xuyên bản đồ, gây sát thương phép và làm choáng tướng địch đầu tiên trúng phải. Thời gian choáng tăng theo khoảng cách bay.' }
    ],
    baseStats: { health: 3150, mana: 380, attackDamage: 168, abilityPower: 0, armor: 88, magicResist: 50, movementSpeed: 360 }
  },
  {
    id: 41,
    name: 'Caitlyn',
    title: 'Cảnh Sát Trưởng Piltover',
    championClass: ChampionClass.MARKSMAN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Caitlyn_0.jpg',
    description: 'Xạ thủ có tầm bắn xa nhất và khả năng đặt bẫy kiểm soát khu vực.',
    abilities: [
      { name: 'Thiện Xạ (Nội tại)', description: 'Sau vài đòn đánh thường hoặc khi tấn công mục tiêu dính Bẫy Yordle/Lưới 90, đòn đánh tiếp theo của Caitlyn được cường hóa, gây thêm sát thương dựa trên tỉ lệ chí mạng và có tầm xa hơn.' },
      { name: 'Bắn Xuyên Táo', description: 'Caitlyn bắn một viên đạn xuyên thấu, gây sát thương vật lý giảm dần cho mỗi mục tiêu trúng phải.' },
      { name: 'Bẫy Yordle', description: 'Caitlyn đặt một cái bẫy làm lộ diện và trói chân tướng địch dẫm phải, đồng thời cường hóa Thiện Xạ lên chúng.' },
      { name: 'Lưới 90', description: 'Caitlyn bắn ra một tấm lưới làm chậm mục tiêu đầu tiên trúng phải và đẩy lùi Caitlyn về phía sau.' },
      { name: 'Bách Phát Bách Trúng', description: 'Caitlyn ngắm bắn một tướng địch ở tầm cực xa, gây sát thương vật lý lớn. Tướng đồng minh có thể đỡ đạn thay.' }
    ],
    baseStats: { health: 3100, mana: 390, attackDamage: 170, abilityPower: 0, armor: 86, magicResist: 50, movementSpeed: 360 }
  },
  {
    id: 42,
    name: 'Jinx',
    title: 'Khẩu Pháo Nổi Loạn',
    championClass: ChampionClass.MARKSMAN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg',
    description: 'Xạ thủ có khả năng tăng tiến sức mạnh khủng khiếp khi tham gia hạ gục.',
    abilities: [
      { name: 'Hưng Phấn! (Nội tại)', description: 'Jinx nhận một lượng lớn tốc độ di chuyển và tốc độ đánh mỗi khi hạ gục hoặc hỗ trợ hạ gục tướng địch hoặc phá hủy công trình.' },
      { name: 'Tráo Hàng!', description: 'Jinx chuyển đổi giữa Súng Phóng Lựu Xương Cá (tầm xa, sát thương lan) và Súng Nhỏ Bằng Chạc (tốc độ đánh cao).' },
      { name: 'Giật Bắn!', description: 'Jinx bắn một luồng điện làm chậm, gây sát thương và làm lộ diện mục tiêu đầu tiên trúng phải.' },
      { name: 'Lựu Đạn Ma Hỏa!', description: 'Jinx ném ra ba quả lựu đạn phát nổ sau một thời gian ngắn, gây sát thương và trói chân kẻ địch đi qua.' },
      { name: 'Tên Lửa Đạn Đạo Siêu Khủng Khiếp!', description: 'Jinx bắn một quả tên lửa xuyên bản đồ, sát thương tăng theo quãng đường bay và gây sát thương dựa trên máu đã mất của mục tiêu, sát thương lan rộng.' }
    ],
    baseStats: { health: 3180, mana: 360, attackDamage: 165, abilityPower: 0, armor: 85, magicResist: 50, movementSpeed: 355 }
  },
  {
    id: 43,
    name: 'Kai\'Sa',
    title: 'Ái Nữ Hư Không',
    championClass: ChampionClass.MARKSMAN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kaisa_0.jpg', // Note: Kaisa, not Kai'Sa
    description: 'Xạ thủ cơ động với khả năng tiến hóa kỹ năng và gây sát thương hỗn hợp.',
    abilities: [
      { name: 'Vỏ Bọc Cộng Sinh (Nội tại)', description: 'Đòn đánh của Kai\'Sa cộng dồn Điện Dịch. Đủ cộng dồn, đòn đánh tiếp theo gây thêm sát thương phép dựa trên máu đã mất. Trang bị giúp Kai\'Sa tiến hóa kỹ năng.' },
      { name: 'Cơn Mưa Icathia', description: 'Kai\'Sa bắn ra một loạt tên lửa nhỏ vào các kẻ địch gần đó. Tiến hóa: Bắn nhiều tên lửa hơn.' },
      { name: 'Tia Truy Kích', description: 'Kai\'Sa bắn một luồng năng lượng tầm xa, gây sát thương phép và áp dụng cộng dồn Điện Dịch. Tiến hóa: Bắn nhiều luồng hơn và áp dụng nhiều cộng dồn hơn.' },
      { name: 'Tích Tụ Năng Lượng', description: 'Kai\'Sa vận sức, tăng tốc độ di chuyển và có thể trở nên vô hình trong thoáng chốc. Tiến hóa: Tàng hình hoàn toàn.' },
      { name: 'Bản Năng Sát Thủ', description: 'Kai\'Sa lướt tới gần một tướng địch bị đánh dấu bởi Điện Dịch, nhận một lớp khiên.' }
    ],
    baseStats: { health: 3200, mana: 370, attackDamage: 167, abilityPower: 0, armor: 87, magicResist: 50, movementSpeed: 370 }
  },
  {
    id: 44,
    name: 'Ezreal',
    title: 'Nhà Thám Hiểm Bảnh Trai',
    championClass: ChampionClass.MARKSMAN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_0.jpg',
    description: 'Xạ thủ cơ động dựa nhiều vào kỹ năng định hướng để cấu rỉa và gây sát thương.',
    abilities: [
      { name: 'Pháp Lực Gia Tăng (Nội tại)', description: 'Trúng kỹ năng giúp Ezreal tăng tốc độ đánh, cộng dồn tối đa 5 lần.' },
      { name: 'Phát Bắn Thần Bí', description: 'Ezreal bắn một tia năng lượng gây sát thương vật lý và áp dụng hiệu ứng đòn đánh. Trúng mục tiêu sẽ giảm hồi chiêu các kỹ năng khác.' },
      { name: 'Tinh Hoa Tuôn Chảy', description: 'Ezreal bắn một quả cầu dính vào tướng hoặc mục tiêu lớn đầu tiên. Tấn công quả cầu sẽ kích nổ nó, gây sát thương phép và hoàn lại năng lượng.' },
      { name: 'Dịch Chuyển Cổ Học', description: 'Ezreal dịch chuyển đến vị trí gần đó và bắn một tia năng lượng vào kẻ địch gần nhất.' },
      { name: 'Cung Ánh Sáng', description: 'Ezreal vận sức rồi bắn một luồng năng lượng cực mạnh xuyên bản đồ, gây sát thương phép lớn lên tất cả kẻ địch trúng phải (giảm dần với mỗi mục tiêu).' }
    ],
    baseStats: { health: 3120, mana: 400, attackDamage: 166, abilityPower: 0, armor: 84, magicResist: 50, movementSpeed: 360 }
  },
  {
    id: 45,
    name: 'Vayne',
    title: 'Thợ Săn Bóng Đêm',
    championClass: ChampionClass.MARKSMAN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_0.jpg',
    description: 'Xạ thủ cơ động với khả năng gây sát thương chuẩn cực cao, đặc biệt mạnh khi đối đầu với các tướng đỡ đòn.',
    abilities: [
      { name: 'Thợ Săn Bóng Đêm (Nội tại)', description: 'Vayne tăng tốc độ di chuyển khi tiến về phía tướng địch.' },
      { name: 'Nhào Lộn', description: 'Vayne nhào lộn một đoạn ngắn. Đòn đánh thường tiếp theo trong vòng vài giây gây thêm sát thương vật lý.' },
      { name: 'Mũi Tên Bạc', description: 'Nội tại: Mỗi đòn đánh hoặc kỹ năng thứ ba liên tiếp lên cùng một mục tiêu gây thêm sát thương chuẩn dựa trên máu tối đa của mục tiêu.' },
      { name: 'Kết Án', description: 'Vayne bắn một mũi tên lớn, gây sát thương vật lý và đẩy lùi mục tiêu. Nếu mục tiêu bị đẩy vào địa hình, chúng bị choáng và nhận thêm sát thương.' },
      { name: 'Giờ Khắc Cuối Cùng', description: 'Vayne tăng Sức Mạnh Công Kích, cường hóa Thợ Săn Bóng Đêm, và khiến Nhào Lộn cho khả năng tàng hình trong thoáng chốc. Thời gian hiệu lực kéo dài khi tướng địch bị Vayne gây sát thương chết gần đó.' }
    ],
    baseStats: { health: 3080, mana: 350, attackDamage: 164, abilityPower: 0, armor: 83, magicResist: 50, movementSpeed: 365 }
  },
  {
    id: 46,
    name: 'Miss Fortune',
    title: 'Thợ Săn Tiền Thưởng',
    championClass: ChampionClass.MARKSMAN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/MissFortune_0.jpg',
    description: 'Xạ thủ với khả năng gây sát thương diện rộng cực lớn trong giao tranh tổng.',
    abilities: [
      { name: 'Đánh Yêu (Nội tại)', description: 'Miss Fortune gây thêm sát thương vật lý khi tấn công một mục tiêu mới.' },
      { name: 'Bắn Một Được Hai', description: 'Miss Fortune bắn một viên đạn vào kẻ địch, sau đó nảy sang mục tiêu phía sau, gây sát thương. Viên đạn thứ hai có thể chí mạng nếu viên đầu hạ gục mục tiêu.' },
      { name: 'Sải Bước', description: 'Nội tại: Tăng tốc độ di chuyển khi không nhận sát thương. Kích hoạt: Tăng mạnh tốc độ đánh trong thời gian ngắn.' },
      { name: 'Mưa Đạn', description: 'Miss Fortune bắn một cơn mưa đạn xuống một khu vực, gây sát thương phép và làm chậm kẻ địch.' },
      { name: 'Bão Đạn', description: 'Miss Fortune bắn một loạt đạn theo hình nón trong vài giây, gây sát thương vật lý lớn. Mỗi loạt đạn có thể chí mạng.' }
    ],
    baseStats: { health: 3160, mana: 375, attackDamage: 169, abilityPower: 0, armor: 86, magicResist: 50, movementSpeed: 355 }
  },
  {
    id: 47,
    name: 'Lucian',
    title: 'Kẻ Thanh Trừng',
    championClass: ChampionClass.MARKSMAN,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lucian_0.jpg',
    description: 'Xạ thủ cơ động với khả năng dồn sát thương nhanh bằng các đòn đánh kép.',
    abilities: [
      { name: 'Xạ Thủ Ánh Sáng (Nội tại)', description: 'Sau khi sử dụng một kỹ năng, đòn đánh tiếp theo của Lucian sẽ bắn hai lần.' },
      { name: 'Tia Sáng Xuyên Thấu', description: 'Lucian bắn một tia sáng xuyên qua mục tiêu, gây sát thương lên tất cả kẻ địch trên đường thẳng.' },
      { name: 'Tia Sáng Rực Cháy', description: 'Lucian bắn một phát đạn phát nổ theo hình ngôi sao, gây sát thương và đánh dấu kẻ địch. Tấn công kẻ địch bị đánh dấu giúp Lucian tăng tốc độ di chuyển.' },
      { name: 'Truy Cùng Diệt Tận', description: 'Lucian lướt một đoạn ngắn. Hiệu ứng Xạ Thủ Ánh Sáng giảm hồi chiêu của kỹ năng này.' },
      { name: 'Thanh Trừng', description: 'Lucian bắn liên tục một loạt đạn theo một hướng trong vài giây, gây sát thương lớn lên tướng địch đầu tiên trúng phải.' }
    ],
    baseStats: { health: 3130, mana: 365, attackDamage: 168, abilityPower: 0, armor: 85, magicResist: 50, movementSpeed: 365 }
  },

  // --- SUPPORT (Hỗ Trợ) ---
  {
    id: 50,
    name: 'Soraka',
    title: 'Tinh Nữ', // Adjusted title
    championClass: ChampionClass.SUPPORT,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Soraka_0.jpg',
    description: 'Hỗ trợ hồi phục mạnh mẽ với khả năng cứu đồng đội từ xa.',
    abilities: [
      { name: 'Cứu Rỗi (Nội tại)', description: 'Soraka chạy nhanh hơn khi hướng về đồng đội thấp máu.' },
      { name: 'Vẫn Tinh', description: 'Gọi một ngôi sao rơi xuống vị trí mục tiêu, gây sát thương phép và làm chậm. Nếu trúng tướng địch, Soraka nhận hiệu ứng Hồi Sức, hồi máu theo thời gian và tăng tốc độ di chuyển khi không hướng về kẻ địch.' },
      { name: 'Tinh Tú Hộ Mệnh', description: 'Soraka hồi máu cho một đồng minh, tiêu tốn một phần máu và năng lượng của bản thân. Không thể sử dụng nếu Soraka quá thấp máu.' },
      { name: 'Điểm Phân Cực', description: 'Soraka tạo một vùng ma thuật tại vị trí mục tiêu, gây sát thương phép và làm câm lặng kẻ địch đứng trong đó. Sau một thời gian ngắn, vùng này phát nổ, trói chân kẻ địch vẫn còn trong đó.' },
      { name: 'Nguyện Ước', description: 'Soraka hồi máu cho toàn bộ tướng đồng minh trên bản đồ. Hiệu quả hồi máu tăng lên với những đồng minh thấp máu.' }
    ],
    baseStats: { health: 3200, mana: 480, attackDamage: 155, abilityPower: 0, armor: 90, magicResist: 50, movementSpeed: 350 }
  },
  {
    id: 51,
    name: 'Thresh',
    title: 'Cai Ngục Xiềng Xích',
    championClass: ChampionClass.SUPPORT,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg',
    description: 'Hỗ trợ đa năng với khả năng khống chế, kéo và cứu đồng đội bằng lồng đèn.',
    abilities: [
      { name: 'Đọa Đày (Nội tại)', description: 'Thresh thu thập linh hồn từ kẻ địch bị hạ gục gần đó, tăng vĩnh viễn Giáp và Sức Mạnh Phép Thuật.' },
      { name: 'Án Tử', description: 'Thresh quăng lưỡi hái, làm choáng và kéo tướng địch đầu tiên trúng phải về phía mình trong một khoảng ngắn. Có thể tái kích hoạt để Thresh lao tới mục tiêu.' },
      { name: 'Con Đường Tăm Tối', description: 'Thresh ném lồng đèn đến một vị trí, tạo lá chắn cho đồng minh đầu tiên đến gần. Đồng minh có thể nhấp vào lồng đèn để được kéo về phía Thresh.' },
      { name: 'Lưỡi Hái Xoáy', description: 'Nội tại: Đòn đánh thường của Thresh gây thêm sát thương phép dựa trên thời gian từ lần đánh cuối. Kích hoạt: Thresh quất xích theo đường thẳng, đẩy lùi và làm chậm kẻ địch trúng phải.' },
      { name: 'Đóng Hộp', description: 'Thresh tạo một nhà tù ma quái bằng các bức tường. Kẻ địch chạm vào tường sẽ nhận sát thương phép và bị làm chậm cực mạnh.' }
    ],
    baseStats: { health: 3300, mana: 370, attackDamage: 158, abilityPower: 0, armor: 95, magicResist: 50, movementSpeed: 360 }
  },
  {
    id: 52,
    name: 'Lulu',
    title: 'Pháp Sư Tinh Linh',
    championClass: ChampionClass.SUPPORT,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lulu_0.jpg',
    description: 'Hỗ trợ đa dụng với khả năng cường hóa đồng minh và vô hiệu hóa kẻ địch.',
    abilities: [
      { name: 'Bạn Đồng Hành Pix (Nội tại)', description: 'Pix, một tinh linh đồng hành, bắn các tia năng lượng vào mục tiêu mà Lulu tấn công.' },
      { name: 'Ngọn Thương Ánh Sáng', description: 'Lulu và Pix mỗi người bắn một tia năng lượng gây sát thương phép và làm chậm kẻ địch đầu tiên trúng phải.' },
      { name: 'Biến Hóa', description: 'Lên đồng minh: Tăng tốc độ đánh và tốc độ di chuyển. Lên kẻ địch: Biến thành một con thú vô hại, không thể tấn công hoặc dùng kỹ năng và bị làm chậm.' },
      { name: 'Giúp Nào Pix!', description: 'Lên đồng minh: Pix nhảy tới che chắn cho họ. Lên kẻ địch: Pix nhảy tới gây sát thương và làm lộ diện mục tiêu.' },
      { name: 'Khổng Lồ Hóa', description: 'Lulu làm một đồng minh (hoặc bản thân) khổng lồ hóa, hất tung kẻ địch xung quanh, tăng máu tối đa và làm chậm kẻ địch ở gần.' }
    ],
    baseStats: { health: 3150, mana: 450, attackDamage: 150, abilityPower: 0, armor: 88, magicResist: 50, movementSpeed: 355 }
  },
  {
    id: 53,
    name: 'Nami',
    title: 'Nàng Tiên Cá',
    championClass: ChampionClass.SUPPORT,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Nami_0.jpg',
    description: 'Hỗ trợ với khả năng hồi máu, cường hóa đòn đánh và khống chế diện rộng.',
    abilities: [
      { name: 'Dậy Sóng (Nội tại)', description: 'Khi kỹ năng của Nami trúng tướng đồng minh, họ được tăng tốc độ di chuyển trong thoáng chốc.' },
      { name: 'Thủy Ngục', description: 'Nami bắn một bong bóng nước vào vị trí mục tiêu, gây sát thương phép và hất tung làm choáng kẻ địch trúng phải.' },
      { name: 'Thủy Triều', description: 'Nami phóng một luồng nước nảy giữa tướng đồng minh và kẻ địch, hồi máu cho đồng minh và gây sát thương phép cho kẻ địch.' },
      { name: 'Ước Nguyện Tiên Cá', description: 'Nami cường hóa đòn đánh thường tiếp theo của một đồng minh trong thời gian ngắn, khiến chúng gây thêm sát thương phép và làm chậm mục tiêu.' },
      { name: 'Sóng Thần', description: 'Nami triệu hồi một cơn sóng thần khổng lồ, gây sát thương phép, hất tung và làm chậm kẻ địch nó cuốn qua.' }
    ],
    baseStats: { health: 3100, mana: 460, attackDamage: 152, abilityPower: 0, armor: 85, magicResist: 50, movementSpeed: 350 }
  },
  {
    id: 54,
    name: 'Janna',
    title: 'Cơn Thịnh Nộ Của Bão Tố',
    championClass: ChampionClass.SUPPORT,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Janna_0.jpg',
    description: 'Hỗ trợ bảo vệ với khả năng tạo lá chắn, hất tung và hồi máu diện rộng.',
    abilities: [
      { name: 'Thuận Gió (Nội tại)', description: 'Janna và tướng đồng minh gần đó được tăng tốc độ di chuyển khi hướng về nhau.' },
      { name: 'Gió Lốc', description: 'Janna tạo một cơn lốc xoáy, vận sức để tăng tầm, sát thương và thời gian hất tung. Tái kích hoạt để phóng lốc.' },
      { name: 'Gió Tây', description: 'Nội tại: Janna tăng tốc độ di chuyển và có thể đi xuyên vật thể. Kích hoạt: Gây sát thương phép và làm chậm một mục tiêu.' },
      { name: 'Mắt Bão', description: 'Janna tạo lá chắn cho một đồng minh hoặc trụ, hấp thụ sát thương và tăng Sức Mạnh Công Kích cho mục tiêu khi khiên còn tồn tại.' },
      { name: 'Gió Mùa', description: 'Janna triệu hồi một cơn bão đẩy lùi kẻ địch xung quanh và hồi máu cho đồng minh trong vùng ảnh hưởng theo thời gian.' }
    ],
    baseStats: { health: 3050, mana: 470, attackDamage: 148, abilityPower: 0, armor: 82, magicResist: 50, movementSpeed: 360 }
  },
  {
    id: 55,
    name: 'Blitzcrank',
    title: 'Người Máy Hơi Nước',
    championClass: ChampionClass.SUPPORT, // Can be played Tank, primary role is Support
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Blitzcrank_0.jpg',
    description: 'Hỗ trợ bắt lẻ mục tiêu cực mạnh với cú kéo trứ danh.',
    abilities: [
      { name: 'Lá Chắn Năng Lượng (Nội tại)', description: 'Khi Blitzcrank thấp máu, hắn nhận một lá chắn dựa trên năng lượng tối đa.' },
      { name: 'Bàn Tay Hỏa Tiễn', description: 'Blitzcrank bắn tay phải của mình, nếu trúng kẻ địch sẽ gây sát thương phép và kéo chúng về phía Blitzcrank.' },
      { name: 'Tăng Tốc', description: 'Blitzcrank tăng mạnh tốc độ di chuyển và tốc độ đánh trong thời gian ngắn. Sau khi hiệu ứng kết thúc, Blitzcrank bị làm chậm tạm thời.' },
      { name: 'Đấm Móc', description: 'Blitzcrank cường hóa đòn đánh tiếp theo, gây gấp đôi sát thương và hất tung mục tiêu lên không.' },
      { name: 'Trường Điện Từ', description: 'Nội tại: Tích điện lên kẻ địch gần đó, gây sát thương phép ngẫu nhiên. Kích hoạt: Gây sát thương phép lớn và làm câm lặng kẻ địch xung quanh, phá hủy lá chắn.' }
    ],
    baseStats: { health: 3400, mana: 350, attackDamage: 165, abilityPower: 0, armor: 100, magicResist: 50, movementSpeed: 355 }
  },
  {
    id: 56,
    name: 'Yuumi',
    title: 'Cô Mèo Ma Thuật',
    championClass: ChampionClass.SUPPORT,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yuumi_0.jpg',
    description: 'Hỗ trợ độc đáo với khả năng bám vào đồng minh, trở nên không thể bị chọn làm mục tiêu.',
    abilities: [
      { name: 'Đánh Ra Khiên (Nội tại)', description: 'Định kỳ, đòn đánh tiếp theo của Yuumi lên tướng địch hồi năng lượng và tạo lá chắn cho bản thân. Nếu Yuumi đang Bám Víu, lá chắn được chuyển cho đồng minh đó.' },
      { name: 'Mũi Tên Thơ Thẩn', description: 'Yuumi bắn một mũi tên gây sát thương phép. Nếu đang Bám Víu, Yuumi có thể điều khiển mũi tên. Mũi tên được cường hóa sẽ gây thêm sát thương và làm chậm.' },
      { name: 'Như Hình Với Bóng', description: 'Nội tại: Yuumi và đồng minh đang Bám Víu nhận thêm Sức Mạnh Thích Nghi. Kích hoạt: Yuumi lướt tới một tướng đồng minh và Bám Víu vào họ, trở nên không thể bị chọn làm mục tiêu (ngoại trừ sát thương từ trụ).' },
      { name: 'Tăng Động', description: 'Yuumi hồi máu và tăng tốc độ di chuyển cho bản thân. Nếu đang Bám Víu, kỹ năng này tác động lên đồng minh đó.' },
      { name: 'Chương Cuối', description: 'Yuumi mở Sách Phép, bắn ra 7 đợt sóng gây sát thương phép. Tướng địch trúng 3 đợt sóng trở lên sẽ bị trói chân.' }
    ],
    baseStats: { health: 2900, mana: 500, attackDamage: 145, abilityPower: 0, armor: 78, magicResist: 50, movementSpeed: 350 }
  },
  {
    id: 57,
    name: 'Karma',
    title: 'Kẻ Được Khai Sáng',
    championClass: ChampionClass.SUPPORT, // Can be played Mage
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Karma_0.jpg',
    description: 'Hỗ trợ linh hoạt, có khả năng gây sát thương, tạo lá chắn và khống chế nhờ Mantra.',
    abilities: [
      { name: 'Tụ Hỏa (Nội tại)', description: 'Kỹ năng và đòn đánh của Karma giảm thời gian hồi chiêu của Kinh Mantra.' },
      { name: 'Nội Hỏa', description: 'Karma bắn một quả cầu năng lượng phát nổ khi trúng địch, gây sát thương phép và làm chậm. Mantra - Hỏa Hồn: Tăng sát thương và để lại một vùng làm chậm, phát nổ sau đó gây thêm sát thương.' },
      { name: 'Chuyên Tâm', description: 'Karma tạo một sợi dây nối với kẻ địch, gây sát thương và làm lộ diện. Nếu sợi dây không bị phá, mục tiêu bị trói chân. Mantra - Khôi Phục: Hồi máu cho Karma và tăng thời gian trói chân.' },
      { name: 'Linh Giáp', description: 'Karma tạo lá chắn cho đồng minh (hoặc bản thân) và tăng tốc độ di chuyển. Mantra - Bất Kham: Lá chắn mạnh hơn và lan sang các đồng minh xung quanh, tăng tốc độ di chuyển cho họ.' },
      { name: 'Kinh Mantra', description: 'Karma cường hóa kỹ năng cơ bản tiếp theo của cô trong vòng 8 giây để có hiệu ứng phụ trội. Bắt đầu với 1 điểm và không cần lên cấp.' }
    ],
    baseStats: { health: 3180, mana: 460, attackDamage: 153, abilityPower: 0, armor: 86, magicResist: 50, movementSpeed: 360 }
  },
  {
    id: 58, // Additional Champion
    name: 'Wukong',
    title: 'Hầu Vương',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/MonkeyKing_0.jpg', // Note: MonkeyKing
    description: 'Đấu sĩ lừa lọc với khả năng tàng hình và chiêu cuối hất tung diện rộng.',
    abilities: [
      { name: 'Mình Đồng Da Sắt (Nội tại)', description: 'Wukong nhận thêm giáp và hồi máu tối đa mỗi 5 giây. Hiệu ứng này tăng lên khi giao tranh với tướng địch hoặc quái vật.' },
      { name: 'Thiết Bảng Ngàn Cân', description: 'Đòn đánh tiếp theo của Wukong được tăng tầm, gây thêm sát thương và giảm giáp mục tiêu.' },
      { name: 'Chim Mồi', description: 'Wukong trở nên vô hình trong thoáng chốc, để lại một phân thân đứng yên. Phân thân sẽ tấn công kẻ địch sau một thời gian.' },
      { name: 'Cân Đẩu Vân', description: 'Wukong lướt tới kẻ địch, tạo ra các phân thân tấn công các mục tiêu khác nhau, gây sát thương. Wukong nhận thêm tốc độ đánh sau đó.' },
      { name: 'Lốc Xoáy', description: 'Wukong xoay gậy, tăng tốc độ di chuyển và gây sát thương, hất tung kẻ địch trúng phải. Có thể tái kích hoạt một lần nữa trong thời gian ngắn.' }
    ],
    baseStats: { health: 3420, attackDamage: 170, abilityPower: 0, armor: 94, magicResist: 51, movementSpeed: 375 }
  },
  {
    id: 59, // Additional Champion
    name: 'Tryndamere',
    title: 'Bá Vương Man Di',
    championClass: ChampionClass.WARRIOR,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Tryndamere_0.jpg',
    description: 'Đấu sĩ cận chiến với khả năng chí mạng cao và chiêu cuối bất tử.',
    abilities: [
      { name: 'Cuồng Nộ Chiến Trường (Nội tại)', description: 'Tryndamere nhận Nộ khi tấn công, chí mạng và hạ gục. Nộ tăng tỉ lệ chí mạng.' },
      { name: 'Say Máu', description: 'Nội tại: Tryndamere tăng SMCK dựa trên máu đã mất. Kích hoạt: Tiêu hao Nộ để hồi máu.' },
      { name: 'Tiếng Thét Uy Hiếp', description: 'Tryndamere hét lên, giảm SMCK của kẻ địch xung quanh. Kẻ địch quay lưng lại bị làm chậm.' },
      { name: 'Chém Xoáy', description: 'Tryndamere xoay kiếm lao tới, gây sát thương lên kẻ địch trên đường đi. Giảm hồi chiêu nếu chí mạng.' },
      { name: 'Từ Chối Tử Thần', description: 'Tryndamere trở nên bất tử trong 5 giây, không thể bị hạ xuống dưới một lượng máu nhất định và nhận Nộ ngay lập tức.' }
    ],
    baseStats: { health: 3550, attackDamage: 178, abilityPower: 0, armor: 93, magicResist: 49, movementSpeed: 380 }
  },
  {
    id: 60,
    name: 'Sylas',
    title: 'Kẻ Phá Xiềng',
    championClass: ChampionClass.MAGE,
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Sylas_0.jpg',
    description: 'Pháp sư đấu sĩ có khả năng cướp chiêu cuối của kẻ địch.',
    abilities: [
      { name: 'Kháng Ma Thuật (Nội tại)', description: 'Sau khi dùng kỹ năng, đòn đánh tiếp theo của Sylas xoay xích gây sát thương diện rộng.' },
      { name: 'Quật Xích', description: 'Sylas quật xích gây sát thương và làm chậm. Sau một khoảng trễ, nơi xích giao nhau phát nổ, gây thêm sát thương và làm chậm mạnh hơn.' },
      { name: 'Đồ Vương', description: 'Sylas lao tới một kẻ địch, gây sát thương và hồi máu. Nếu kẻ địch thấp máu, sát thương và hồi máu tăng.' },
      { name: 'Trốn/Bắt', description: 'Sylas lướt đi một đoạn ngắn, nhận lá chắn. Tái kích hoạt để quăng xích, kéo bản thân tới tướng địch đầu tiên trúng phải, gây sát thương và hất tung.' },
      { name: 'Tước Đoạt', description: 'Sylas cướp chiêu cuối của một tướng địch. Sylas có thể sử dụng chiêu cuối đó, nhưng không thể cướp lại cùng một tướng trong một khoảng thời gian.' }
    ],
    baseStats: { health: 3380, mana: 380, attackDamage: 164, abilityPower: 0, armor: 91, magicResist: 52, movementSpeed: 375 }
  }
];