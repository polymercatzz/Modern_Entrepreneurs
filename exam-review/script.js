// ===================== Question bank =====================
// type: "mcq" = แนวคิด, "output" = อ่านโค้ดทายผล, "bug" = หาจุดผิด
// answer = index ของตัวเลือกที่ถูก (ก่อนสุ่ม)

const LESSONS = {
  w10: {
    week: "Week 10",
    title: "Caching",
    questions: [
      {
        id: "w10-1", type: "mcq",
        q: "ผู้ใช้เลื่อน slider ในแอปที่มีฟังก์ชัน @st.cache_data และเป็น cache hit ข้อใดอธิบายสิ่งที่เกิดขึ้นได้ถูกต้องที่สุด?",
        options: [
          "สคริปต์ rerun ตั้งแต่บนลงล่าง แต่ตัวฟังก์ชันที่ cache ไว้ไม่ถูกรัน",
          "สคริปต์ไม่ rerun เลยเพราะผลลัพธ์อยู่ใน cache แล้ว",
          "Streamlit รันเฉพาะบรรทัดที่อยู่หลัง slider",
          "ฟังก์ชันถูกรันใหม่ แต่ผลลัพธ์ไม่ถูกแสดงซ้ำ"
        ],
        answer: 0,
        explain: "Cache ข้ามแค่ <b>ตัวฟังก์ชัน</b> ที่ cache ไว้ ไม่ได้ข้ามการ rerun สคริปต์ส่วนที่เหลือยังรันใหม่ทั้งหมด"
      },
      {
        id: "w10-2", type: "output",
        q: "เรียกฟังก์ชันตามลำดับนี้ใน session เดียว (cache ว่างตอนเริ่ม) ตัวฟังก์ชัน slow_square ถูกรันจริงกี่ครั้ง?",
        code: `@st.cache_data
def slow_square(x):
    time.sleep(3)
    return x * x

slow_square(5)
slow_square(5)
slow_square(7)
slow_square(5)
slow_square(7)`,
        options: ["2 ครั้ง", "1 ครั้ง", "3 ครั้ง", "5 ครั้ง"],
        answer: 0,
        explain: "MISS ที่ slow_square(5) และ slow_square(7) ครั้งแรก ที่เหลือเป็น HIT ฟังก์ชันเดียวเก็บได้หลาย entry แยกตาม argument"
      },
      {
        id: "w10-3", type: "mcq",
        q: "ฟังก์ชันที่คืนค่า pipeline(\"sentiment-analysis\") หรือ database connection ควรใช้ decorator ใด?",
        options: [
          "@st.cache_resource",
          "@st.cache_data",
          "ไม่ต้อง cache เพราะ Streamlit จำ object ให้อยู่แล้ว",
          "@st.cache_data(ttl=0)"
        ],
        answer: 0,
        explain: "ML model และ DB connection เป็น <b>shared resource</b> ที่สร้างแพง ควรใช้ object ตัวเดียวร่วมกัน ส่วน cache_data จะ serialize/copy ผลลัพธ์ ซึ่งเหมาะกับข้อมูลอย่าง DataFrame, dict, list"
      },
      {
        id: "w10-4", type: "output",
        q: "ผู้ใช้ A กดปุ่ม Append 99 หนึ่งครั้ง จากนั้นผู้ใช้ B เปิดแอปในเครื่องอื่น ผู้ใช้ B จะเห็นอะไร?",
        code: `@st.cache_resource
def create_list():
    return [1, 2, 3]

my_list = create_list()
if st.button("Append 99"):
    my_list.append(99)
st.write("Current list:", my_list)`,
        options: [
          "Current list: [1, 2, 3, 99]",
          "Current list: [1, 2, 3]",
          "Current list: [99]",
          "Error เพราะ list hash ไม่ได้"
        ],
        answer: 0,
        explain: "cache_resource คืน <b>object ตัวเดียวกัน</b> ให้ทุก session ถ้ามีคน mutate คนอื่นจะเห็นด้วย ถ้าเปลี่ยนเป็น @st.cache_data ผู้ใช้ B จะได้สำเนาใหม่ [1, 2, 3]"
      },
      {
        id: "w10-5", type: "bug",
        q: "โค้ดนี้รันรอบแรกผ่าน แต่ rerun รอบถัดไปเกิด ValueError: 1 is not in list สาเหตุคืออะไร?",
        code: `@st.cache_resource
def get_numbers():
    return [1, 2, 3]

numbers = get_numbers()
numbers.remove(1)`,
        options: [
          "cache_resource คืน object เดิมที่ถูก remove(1) ไปแล้ว รอบถัดไปจึงไม่มี 1 ให้ลบ",
          "get_numbers ไม่มี argument จึง hash ไม่ได้",
          "cache_resource ใช้กับ list ไม่ได้ ต้องใช้กับ model เท่านั้น",
          "ต้องเรียก get_numbers.clear() ก่อน remove"
        ],
        answer: 0,
        explain: "เป็นตัวอย่าง <b>shared mutable object</b> รอบแรก object ที่แชร์กลายเป็น [2, 3] rerun ถัดไปได้ object เดิมแล้วสั่ง remove(1) อีกครั้งจึงพัง วิธีแก้คือใช้ cache_data (ได้สำเนา) หรือห้าม mutate resource ที่แชร์"
      },
      {
        id: "w10-6", type: "output",
        q: "จากโค้ดนี้ ข้อใดถูกต้องเกี่ยวกับ cache key?",
        code: `@st.cache_data
def fetch_data(_db_connection, num_rows):
    return _db_connection.fetch(num_rows)`,
        options: [
          "num_rows เป็นส่วนหนึ่งของ cache key ส่วน _db_connection ไม่นับ",
          "ทั้งสอง parameter เป็นส่วนหนึ่งของ cache key",
          "_db_connection เป็น cache key ส่วน num_rows ไม่นับ",
          "underscore ทำให้ parameter นั้นเป็น private และเรียกจากข้างนอกไม่ได้"
        ],
        answer: 0,
        explain: "ใส่ <code>_</code> นำหน้าชื่อ parameter เพื่อบอกให้ Streamlit ไม่ hash ค่านั้น เหมาะกับ object ที่ hash ไม่ได้ แต่อย่าละ parameter ที่มีผลต่อผลลัพธ์"
      },
      {
        id: "w10-7", type: "mcq",
        q: "@st.cache_data(ttl=3600) มีผลอย่างไร?",
        options: [
          "entry ใน cache หมดอายุหลัง 1 ชั่วโมง การเรียกครั้งถัดไปจะรันฟังก์ชันใหม่",
          "เก็บ entry ได้สูงสุด 3600 รายการ",
          "ฟังก์ชันจะถูกรันใหม่อัตโนมัติทุก 3600 มิลลิวินาที",
          "แสดง spinner นาน 3600 วินาที"
        ],
        answer: 0,
        explain: "ttl = time-to-live หน่วยเป็นวินาที (3600 = 1 ชั่วโมง) ใช้แก้ปัญหาข้อมูลเก่า (stale) ใช้ timedelta(hours=1) แทนได้"
      },
      {
        id: "w10-8", type: "mcq",
        q: "ข้อใดถูกต้องเกี่ยวกับ @st.cache_data(max_entries=1000)?",
        options: [
          "จำกัดจำนวน entry เมื่อเต็มแล้วมี entry ใหม่ entry ที่เก่าสุดจะถูกลบ",
          "จำกัดขนาด cache ไว้ที่ 1000 bytes",
          "จำกัดจำนวนผู้ใช้ที่ใช้ cache ร่วมกันได้ 1000 คน",
          "เมื่อเต็มแล้ว cache จะหยุดเก็บ entry ใหม่"
        ],
        answer: 0,
        explain: "max_entries คุม <b>จำนวน</b> entry ไม่ใช่ขนาดเป็นไบต์ ขนาดของแต่ละ object จึงยังสำคัญ"
      },
      {
        id: "w10-9", type: "output",
        q: "ทำไมจึงส่ง file_mtime เข้าไปในฟังก์ชัน ทั้งที่ในตัวฟังก์ชันไม่ได้ใช้?",
        code: `@st.cache_data
def load_data(path, file_mtime):
    return pd.read_csv(path)

mtime = os.path.getmtime("data.csv")
df = load_data("data.csv", mtime)`,
        options: [
          "เมื่อไฟล์ถูกแก้ mtime จะเปลี่ยน ทำให้เป็น cache miss และโหลดข้อมูลใหม่อัตโนมัติ",
          "เพื่อให้ pandas อ่านไฟล์เร็วขึ้น",
          "เพื่อให้ cache หมดอายุทุกวินาที",
          "เป็นโค้ดเกินที่ไม่มีผลอะไร"
        ],
        answer: 0,
        explain: "หลักการ <b>Version the input</b>: ถ้าแหล่งข้อมูลจริงเปลี่ยน ให้การเปลี่ยนนั้นปรากฏใน input ของฟังก์ชัน ถ้าไม่ทำ path เดิมจะ HIT และได้ DataFrame เก่า (stale)"
      },
      {
        id: "w10-10", type: "mcq",
        q: "ข้อใด <u>ไม่ควร</u> cache มากที่สุด?",
        options: [
          "ฟังก์ชันส่งอีเมลแจ้งเตือนทุกครั้งที่ผู้ใช้กด Submit",
          "อ่าน CSV ขนาดใหญ่ที่เปลี่ยนวันละครั้ง (ใช้ ttl)",
          "โหลดโมเดลที่ train แล้วซึ่งใช้ซ้ำทุก request",
          "transformation ที่ใช้เวลานานและ input ซ้ำบ่อย"
        ],
        answer: 0,
        explain: "งานที่มี <b>side effect</b> ซึ่งต้องเกิดจริงทุกครั้งไม่ควร cache (ถ้า HIT อีเมลจะไม่ถูกส่ง) ที่ไม่ควร cache อีก: เลขคณิตง่ายๆ, input ที่ไม่ซ้ำ, state ของผู้ใช้ที่เปลี่ยนได้"
      }
    ]
  },

  w11: {
    week: "Week 11",
    title: "Session State",
    questions: [
      {
        id: "w11-1", type: "output",
        q: "ผู้ใช้กดปุ่ม Add 1 ทั้งหมด 3 ครั้ง หน้าจอจะแสดงค่าอะไร?",
        code: `count = 0
if st.button("Add 1", key="btn_1"):
    count += 1
st.write("Count:", count)`,
        options: ["Count: 1", "Count: 3", "Count: 0", "Count: 4"],
        answer: 0,
        explain: "ทุกครั้งที่กด สคริปต์ rerun และรัน <code>count = 0</code> ใหม่ ปุ่มเป็น True แค่รอบนั้น จึงได้ 1 เสมอ ตัวแปรธรรมดาอยู่แค่ใน script run เดียว"
      },
      {
        id: "w11-2", type: "mcq",
        q: "ข้อใดเป็นวิธี initialize ค่าใน Session State ที่ถูกต้อง?",
        options: [
          "if \"count\" not in st.session_state:\n    st.session_state.count = 0",
          "st.session_state.count = 0  (เขียนไว้บนสุดของไฟล์)",
          "count = st.session_state.get(\"count\") + 1",
          "@st.cache_data แล้ว return 0"
        ],
        answer: 0,
        explain: "ต้องเช็คก่อนว่ามี key หรือยัง ถ้าตั้งค่าตรงๆ ทุกรอบ ค่าจะถูกรีเซ็ตเป็น 0 ทุก rerun"
      },
      {
        id: "w11-3", type: "mcq",
        q: "ผู้ใช้คนเดียวกันเปิดแอปเดียวกันใน 2 แท็บ แล้วกด counter ในแท็บแรก 5 ครั้ง แท็บที่สองจะเป็นอย่างไร?",
        options: [
          "ค่าไม่เปลี่ยน เพราะแต่ละแท็บเป็นคนละ session มี session_state แยกกัน",
          "ค่าเป็น 5 เพราะเป็นผู้ใช้คนเดียวกัน",
          "ค่าเป็น 5 เพราะ session_state ใช้ร่วมกันบน server",
          "แท็บที่สองจะ error"
        ],
        answer: 0,
        explain: "<b>1 แท็บ = 1 session</b> server และแอปใช้ร่วมกัน แต่ session memory ไม่ได้แชร์ ต่างจาก cache ที่แชร์ทุก session"
      },
      {
        id: "w11-4", type: "output",
        q: "เปิดแอปครั้งแรก (ยังไม่กดอะไรเลย) หน้าจอจะแสดงค่าอะไร?",
        code: `if "count" not in st.session_state:
    st.session_state.count = 0

def increment_counter():
    st.session_state.count += 1

st.button("Increment", on_click=increment_counter())
st.write("Count =", st.session_state.count)`,
        options: ["Count = 1", "Count = 0", "Error: on_click ต้องเป็น string", "ไม่แสดงอะไร"],
        answer: 0,
        explain: "<code>on_click=increment_counter()</code> คือ <b>เรียก</b> ฟังก์ชันทันทีขณะสร้างปุ่ม ค่าจึงเพิ่มทุก rerun แม้ไม่ได้กด วิธีที่ถูกคือ <code>on_click=increment_counter</code> (ส่งฟังก์ชัน ไม่ใส่วงเล็บ)"
      },
      {
        id: "w11-5", type: "bug",
        q: "โค้ดนี้เกิด StreamlitAPIException เพราะอะไร?",
        code: `st.slider("My slider", 1, 10, value=5, key="my_slider")
st.session_state.my_slider = 7`,
        options: [
          "แก้ค่า Session State ของ key ที่ผูกกับ widget หลังจากสร้าง widget ไปแล้ว",
          "slider ต้องมี min_value และ max_value เป็น float",
          "key ห้ามมีเครื่องหมาย _",
          "ต้องใช้ st.session_state[\"my_slider\"] แทน attribute syntax"
        ],
        answer: 0,
        explain: "ถ้า Session State คุมค่าของ widget ต้องตั้งค่า <b>ก่อน</b> สร้าง widget: <code>if \"my_slider\" not in st.session_state: st.session_state.my_slider = 7</code> แล้วค่อย <code>st.slider(..., key=\"my_slider\")</code> (ไม่ต้องใส่ value= ซ้ำ)"
      },
      {
        id: "w11-6", type: "mcq",
        q: "เมื่อผู้ใช้กดปุ่มที่มี on_click callback ลำดับการทำงานข้อใดถูกต้อง?",
        options: [
          "callback รัน → state อัปเดต → สคริปต์ rerun บนลงล่าง",
          "สคริปต์ rerun → callback รันตอนถึงบรรทัดปุ่ม → state อัปเดต",
          "สคริปต์ rerun จนจบ → callback รันท้ายสุด",
          "callback รันแทนการ rerun สคริปต์จึงไม่ rerun"
        ],
        answer: 0,
        explain: "Callback รัน <b>ก่อน</b> rerun ค่าที่อัปเดตจึงใช้ได้ตั้งแต่บรรทัดแรกของรอบถัดไป"
      },
      {
        id: "w11-7", type: "output",
        q: "ผู้ใช้พิมพ์ \"Ada\" ในช่อง text input บรรทัดสุดท้ายจะแสดงอะไร?",
        code: `st.text_input("Your name", key="name")
st.write(st.session_state["name"])`,
        options: [
          "Ada",
          "Your name",
          "KeyError เพราะไม่ได้ initialize \"name\"",
          "None"
        ],
        answer: 0,
        explain: "widget ที่มี <code>key</code> จะเขียนค่าปัจจุบันลง <code>st.session_state[key]</code> อัตโนมัติ ค่าที่ widget คืนกับค่าใน state จึงเป็นค่าเดียวกัน"
      },
      {
        id: "w11-8", type: "bug",
        q: "ต้องการให้แอปจำว่าผู้ใช้กด Submit แล้ว ข้อใดถูกต้อง?",
        code: `# แบบ A
if "my_button" not in st.session_state:
    st.session_state.my_button = True
st.button("Submit", key="my_button")

# แบบ B
if "submitted" not in st.session_state:
    st.session_state.submitted = False
if st.button("Submit"):
    st.session_state.submitted = True`,
        options: [
          "แบบ B ถูก: เก็บผลลัพธ์ของการกด แบบ A จะ error เพราะห้ามตั้งค่า state ของ button",
          "แบบ A ถูก: ปุ่มจะเป็น True ตลอด",
          "ทั้งสองแบบถูกและให้ผลเหมือนกัน",
          "ทั้งสองแบบผิด ต้องใช้ @st.cache_data"
        ],
        answer: 0,
        explain: "ปุ่มเป็น True แค่ <b>rerun เดียว</b> (เป็น event ชั่วคราว) Streamlit จัดการเองและห้ามตั้งค่าผ่าน Session State ให้เก็บ <b>ผลลัพธ์</b> ที่ต้องการให้คงอยู่แทน"
      },
      {
        id: "w11-9", type: "mcq",
        q: "ใน st.form ถ้าต้องการให้ callback ทำงานตอนผู้ใช้ส่งฟอร์ม ต้องใส่ callback ไว้ที่ไหน?",
        options: [
          "on_click ของ st.form_submit_button",
          "on_change ของ text_input ทุกช่องในฟอร์ม",
          "argument ของ st.form(\"chat_form\", on_submit=...)",
          "ใส่ไว้นอกฟอร์มด้วย st.button"
        ],
        answer: 0,
        explain: "ฟอร์มรวม input ไว้เป็นชุด ปุ่ม submit คือ event ที่ยืนยันการอัปเดต state จึงใส่ callback ที่ <code>st.form_submit_button(..., on_click=...)</code>"
      },
      {
        id: "w11-10", type: "mcq",
        q: "ข้อมูลใดเหมาะเก็บใน Session State ที่สุด?",
        options: [
          "ประวัติแชทของผู้ใช้คนหนึ่งในแท็บปัจจุบัน",
          "โมเดลขนาดใหญ่ที่ผู้ใช้ทุกคนใช้ร่วมกัน",
          "รายการ ticket ที่ต้องเก็บถาวรแม้ปิดแอป",
          "ผลลัพธ์การคำนวณที่แพงและเหมือนกันทุกคน"
        ],
        answer: 0,
        explain: "ถามว่า <b>ใครควรเห็น</b> (คนเดียว → Session State, ทุกคน → Cache/storage) และ <b>อยู่นานแค่ไหน</b> (จนปิดแท็บ → Session State, ข้ามการเข้าใช้ → file/database)"
      }
    ]
  },

  l12: {
    week: "Lab 12",
    title: "Supabase",
    questions: [
      {
        id: "l12-1", type: "mcq",
        q: "ข้อใดอธิบาย Supabase ได้ถูกต้องที่สุด?",
        options: [
          "Backend-as-a-Service แบบ open-source ที่สร้างบน PostgreSQL",
          "ฐานข้อมูล NoSQL แบบ document ของ Google",
          "แพลตฟอร์ม deploy แอป Streamlit",
          "ไลบรารี Python สำหรับ train โมเดล"
        ],
        answer: 0,
        explain: "Supabase คือ <b>BaaS</b> แบบ open-source บน <b>PostgreSQL</b> (relational/SQL) ช่วยสร้าง backend ได้เร็ว"
      },
      {
        id: "l12-2", type: "mcq",
        q: "Row-Level Security (RLS) คืออะไร?",
        options: [
          "กลไกของ PostgreSQL ที่กำหนด Policy ว่าผู้ใช้แต่ละประเภท SELECT/INSERT/UPDATE/DELETE แถวไหนได้",
          "การเข้ารหัสทุกแถวในตารางด้วย AES",
          "การล็อกแถวไม่ให้แก้ไขพร้อมกันหลายคน",
          "การจำกัดจำนวนแถวที่ query ได้ต่อครั้ง"
        ],
        answer: 0,
        explain: "RLS ควบคุมสิทธิ์ <b>ระดับแถว</b> ผ่าน Policy เช่น ให้ผู้ใช้เห็นเฉพาะข้อมูลของตัวเอง หรือให้แอดมินเห็นทั้งหมด"
      },
      {
        id: "l12-3", type: "mcq",
        q: "ทำไม Lab 12 จึงปิด RLS ตอนสร้างตาราง helpdesk_tickets?",
        options: [
          "Lab ยังไม่ใช้ Authentication และเป็นข้อมูลจำลอง จึงต้องการโฟกัสที่การเชื่อมต่อและการ query",
          "RLS ทำให้ import CSV ไม่ได้",
          "Supabase ไม่รองรับ RLS บน Region Singapore",
          "ระบบจริงไม่จำเป็นต้องใช้ RLS"
        ],
        answer: 0,
        explain: "เป็นการปิดเพื่อการเรียนเท่านั้น ระบบจริงที่มีผู้ใช้หลายประเภทหรือข้อมูลที่ต้องควบคุมสิทธิ์ <b>ควรเปิด RLS</b> และตั้ง Policy ให้เหมาะสม"
      },
      {
        id: "l12-4", type: "bug",
        q: "นักศึกษาตั้งค่า secrets.toml แบบนี้เพื่อเชื่อม Streamlit กับ Supabase ใน Lab ผิดตรงไหน?",
        code: `# .streamlit/secrets.toml
supabase_url = "https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
supabase_key = "sb_secret_..."`,
        options: [
          "ใช้ Secret key ซึ่งมีสิทธิ์สูงและข้าม RLS ได้ ต้องใช้ Publishable key (sb_publishable_...)",
          "URL ต้องขึ้นต้นด้วย http:// ไม่ใช่ https://",
          "ไฟล์ต้องชื่อ config.toml",
          "ไม่มีจุดผิด"
        ],
        answer: 0,
        explain: "Lab ห้ามใช้ <b>Secret key / Service Role key</b> เพราะมีสิทธิ์ระดับสูงและข้าม RLS ได้ ให้ใช้ <b>Publishable key</b> เท่านั้น"
      },
      {
        id: "l12-5", type: "mcq",
        q: "เหตุผลหลักที่เก็บ API URL และ key ไว้ใน .streamlit/secrets.toml แทนการเขียนลงในโค้ดตรงๆ คืออะไร?",
        options: [
          "แยก configuration ออกจาก source code ป้องกันการเผยแพร่ค่าลับไปพร้อมโค้ด",
          "ทำให้เชื่อมต่อ Supabase ได้เร็วขึ้น",
          "Supabase อ่านค่าได้จาก secrets.toml เท่านั้น",
          "เพื่อให้ cache_resource ทำงานได้"
        ],
        answer: 0,
        explain: "เป็นแนวปฏิบัติที่ดีในการจัดการค่าเชื่อมต่อ และใช้ต่อใน Week 13 ที่ย้ายค่าไปไว้ใน Secrets บน cloud โดยไม่ต้องแก้โค้ด"
      },
      {
        id: "l12-6", type: "output",
        q: "หลังรัน SQL นี้ใน SQL Editor ผู้ใช้แบบ anon ทำอะไรได้?",
        code: `GRANT SELECT ON TABLE
  public.helpdesk_tickets,
  public.helpdesk_validation
TO anon;`,
        options: [
          "อ่าน (SELECT) ข้อมูลได้ทั้งสองตาราง แต่เพิ่ม/แก้/ลบไม่ได้",
          "อ่านและเขียนได้ทั้งสองตาราง",
          "อ่านได้เฉพาะ helpdesk_tickets",
          "ลบตารางได้"
        ],
        answer: 0,
        explain: "<code>GRANT SELECT</code> ให้สิทธิ์ <b>อ่านอย่างเดียว</b> กับ role <code>anon</code> (ผู้ใช้ไม่ระบุตัวตนที่เชื่อมต่อด้วย publishable key) ครอบคลุมทั้งสองตารางที่ระบุ"
      },
      {
        id: "l12-7", type: "mcq",
        q: "ตอน import helpdesk_tickets_timestamped.csv ควรตั้งค่าคอลัมน์อย่างไร?",
        options: [
          "ticket_id เป็น Primary key และ created_at เป็น timestamp",
          "created_at เป็น Primary key และ ticket_id เป็น text",
          "query_id เป็น Primary key",
          "ไม่ต้องมี Primary key"
        ],
        answer: 0,
        explain: "helpdesk_tickets: <b>ticket_id</b> = PK, <b>created_at</b> = timestamp ส่วนตาราง helpdesk_validation ใช้ <b>query_id</b> เป็น PK"
      },
      {
        id: "l12-8", type: "mcq",
        q: "ส่วนขยายใดของ Supabase ที่ช่วยงาน AI เช่น RAG (Retrieval-Augmented Generation)?",
        options: ["pgvector", "Edge Functions", "Realtime", "GraphQL"],
        answer: 0,
        explain: "<b>pgvector</b> ใช้เก็บและค้นหา vector (embeddings) สำหรับระบบ AI และ RAG"
      },
      {
        id: "l12-9", type: "mcq",
        q: "ข้อใด <u>ไม่ใช่</u> ข้อดีของ Supabase ตามเนื้อหาใน Lab?",
        options: [
          "ไม่ต้องออกแบบ schema เพราะเป็น NoSQL",
          "สร้าง REST และ GraphQL API ให้อัตโนมัติตาม schema",
          "ไม่มีปัญหา Vendor Lock-in เพราะ self-host หรือย้าย cloud ได้",
          "ควบคุมสิทธิ์ละเอียดด้วย RLS"
        ],
        answer: 0,
        explain: "Supabase เป็น <b>relational</b> (PostgreSQL, SQL) ไม่ใช่ NoSQL และ API ถูกสร้างจาก Database Schema ที่ออกแบบไว้"
      },
      {
        id: "l12-10", type: "mcq",
        q: "ฟีเจอร์ Realtime ของ Supabase ซิงค์ข้อมูลระหว่างฐานข้อมูลกับแอปผ่านเทคโนโลยีใด?",
        options: ["WebSockets", "FTP", "Cron job ทุก 1 นาที", "Email notification"],
        answer: 0,
        explain: "ฟีเจอร์หลัก: Database (PostgreSQL), Authentication (อีเมล/รหัสผ่าน/OAuth), Storage, <b>Realtime ผ่าน WebSockets</b>, Edge Functions (Serverless)"
      }
    ]
  },

  w13: {
    week: "Week 13",
    title: "Deploy",
    questions: [
      {
        id: "w13-1", type: "mcq",
        q: "ข้อใด <u>ไม่ใช่</u> หนึ่งในสี่สิ่งที่ deployment ต้องมีตามเนื้อหา?",
        options: [
          "ไฟล์ .streamlit/secrets.toml ที่ commit ขึ้น GitHub",
          "Application Code (main.py)",
          "Dependencies (requirements.txt)",
          "Cloud Environment (Python, CPU, memory, storage)"
        ],
        answer: 0,
        explain: "สี่ส่วนคือ Code, Dependencies, Configuration/Secrets และ Cloud Environment Secrets ต้องใส่ผ่าน Advanced settings บน cloud <b>ห้าม commit</b> secrets.toml"
      },
      {
        id: "w13-2", type: "bug",
        q: "แอปรันในเครื่องได้ แต่บน Community Cloud ขึ้น ModuleNotFoundError: No module named 'sklearn' ควรแก้ที่ไหนก่อน?",
        code: `# requirements.txt
streamlit
pandas
supabase`,
        options: [
          "เพิ่ม scikit-learn ใน requirements.txt",
          "ติดตั้ง scikit-learn ในเครื่องตัวเองอีกครั้ง",
          "เปลี่ยน Region ของ Supabase",
          "ลบ cache ด้วย st.cache_data.clear()"
        ],
        answer: 0,
        explain: "Cloud สร้าง environment ใหม่ <b>ไม่ได้คัดลอก</b> ของในเครื่องไป ต้องระบุ library ที่ใช้ทุกตัวใน requirements.txt"
      },
      {
        id: "w13-3", type: "output",
        q: "ถ้าย้ายแอปนี้จากเครื่องขึ้น Streamlit Community Cloud ต้องแก้โค้ดบรรทัดนี้อย่างไร?",
        code: `url = st.secrets["supabase_url"]
key = st.secrets["supabase_key"]`,
        options: [
          "ไม่ต้องแก้โค้ด แค่ใส่ค่าใน Advanced settings → Secrets บน cloud",
          "เปลี่ยนเป็น os.environ[\"supabase_url\"]",
          "เขียน URL และ key ลงในโค้ดตรงๆ",
          "เปลี่ยนเป็น st.cloud_secrets[...]"
        ],
        answer: 0,
        explain: "โค้ดใช้ <code>st.secrets</code> เหมือนเดิมทั้งสองที่ <b>เปลี่ยนแค่ที่เก็บค่า</b>: ในเครื่องคือ .streamlit/secrets.toml บน cloud คือ Advanced settings → Secrets"
      },
      {
        id: "w13-4", type: "mcq",
        q: "ควรจัดการไฟล์ .streamlit/secrets.toml อย่างไรเมื่อ push โปรเจคขึ้น GitHub?",
        options: [
          "ใส่ไว้ใน .gitignore เพื่อไม่ให้ถูก commit",
          "commit ไว้เพื่อให้ Community Cloud อ่านได้",
          "ย้ายไปไว้ในโฟลเดอร์ public",
          "เปลี่ยนชื่อเป็น secrets.txt แล้ว commit"
        ],
        answer: 0,
        explain: "ห้าม commit API key, password หรือ secrets.toml ขึ้น GitHub"
      },
      {
        id: "w13-5", type: "bug",
        q: "แอปอ่านไฟล์ได้ในเครื่อง (Windows) แต่บน cloud ขึ้น FileNotFoundError สาเหตุใดเป็นไปได้มากที่สุด?",
        code: `df = pd.read_csv("C:/Users/me/Desktop/Data.csv")`,
        options: [
          "ใช้ path เฉพาะเครื่อง ไฟล์อาจไม่อยู่ใน repo หรือตัวพิมพ์เล็ก/ใหญ่ของชื่อไฟล์ไม่ตรง",
          "Community Cloud อ่าน CSV ไม่ได้",
          "ต้องใส่ pandas ใน secrets",
          "ต้องเปลี่ยนเป็น @st.cache_resource"
        ],
        answer: 0,
        explain: "File not found: ไฟล์ไม่อยู่ใน repo, path ผิด หรือตัวพิมพ์ไม่ตรง (Linux บน cloud แยกตัวพิมพ์เล็ก/ใหญ่) ให้ใส่ไฟล์ใน repo และใช้ relative path เช่น <code>\"data.csv\"</code>"
      },
      {
        id: "w13-6", type: "mcq",
        q: "แอปบันทึก ticket ใหม่ลงไฟล์ CSV บนเซิร์ฟเวอร์ของ Community Cloud ข้อใดถูกต้อง?",
        options: [
          "ไม่รับประกันว่าไฟล์จะคงอยู่ ควรเก็บข้อมูลถาวรใน Supabase",
          "ไฟล์คงอยู่ถาวรเหมือนในเครื่อง",
          "ไฟล์จะถูก push กลับเข้า GitHub อัตโนมัติ",
          "ไฟล์จะถูกเก็บใน Session State"
        ],
        answer: 0,
        explain: "Cloud-local storage <b>ไม่รับประกันว่าคงอยู่</b> ข้อมูลที่ต้องเก็บถาวรให้ใช้ database ภายนอกอย่าง Supabase"
      },
      {
        id: "w13-7", type: "mcq",
        q: "หลัง deploy แล้วพบบั๊ก แก้โค้ดในเครื่องและ push ขึ้น branch ที่เลือกไว้ จะเกิดอะไรขึ้น?",
        options: [
          "Community Cloud เห็นการเปลี่ยนแปลงใน branch และอัปเดตแอปให้",
          "ต้องลบแอปแล้วสร้างใหม่ทุกครั้ง",
          "ต้องส่งไฟล์ให้ Streamlit ทางอีเมล",
          "แอปไม่เปลี่ยนจนกว่าจะเปลี่ยน Public URL"
        ],
        answer: 0,
        explain: "วงจร <b>Deploy → Test → Fix → Redeploy</b>: Community Cloud ดู GitHub branch ที่เลือกและอัปเดตแอปหลัง push การ deploy เป็นส่วนหนึ่งของการพัฒนา ไม่ใช่ทำครั้งเดียวตอนท้าย"
      },
      {
        id: "w13-8", type: "mcq",
        q: "Deploy แล้วได้ Public URL ที่คนอื่นเปิดได้ แปลว่าระบบ production-ready แล้วหรือไม่?",
        options: [
          "ยังไม่ใช่ URL แค่พิสูจน์ว่าเข้าถึงได้ ยังต้องมี security, operations และ capacity planning",
          "ใช่ เพราะผู้ใช้เปิดได้แล้ว",
          "ใช่ ถ้าใช้ Supabase",
          "ใช่ ถ้า pin version ใน requirements.txt"
        ],
        answer: 0,
        explain: "Production ต้องมี Security (Authentication, Authorization, RLS), Operations (monitoring, backup, reliability) และ Capacity (scaling, resource limits, cost)"
      },
      {
        id: "w13-9", type: "mcq",
        q: "การ pin version ของ package ใน requirements.txt (เช่น pandas==2.2.2) ช่วยเรื่องใด?",
        options: [
          "ทำให้ environment สร้างซ้ำได้ ลดปัญหาพฤติกรรมเปลี่ยนเพราะ version ไม่ตรงกัน",
          "ทำให้แอปโหลดเร็วขึ้นเพราะ cache อัตโนมัติ",
          "ทำให้ไม่ต้องใส่ secrets",
          "ทำให้ Python version ตรงกันอัตโนมัติ"
        ],
        answer: 0,
        explain: "requirements.txt ระบุ dependency การ pin version ที่ทดสอบแล้วทำให้ environment <b>reproducible</b> ส่วน Python version ต้องเลือกแยกใน Advanced settings"
      },
      {
        id: "w13-10", type: "mcq",
        q: "เปิด Public URL แล้วเจอแอปตัวอื่นที่ไม่ใช่ main.py ที่ตั้งใจ ควรตรวจอะไรก่อน?",
        options: [
          "repository, branch และ entrypoint (main file) ที่เลือกตอน Create app",
          "requirements.txt",
          "ค่า ttl ของ cache",
          "Policy ของ RLS"
        ],
        answer: 0,
        explain: "แอปผิดตัวขึ้นมา → repository, branch หรือ entrypoint ผิด ทุกปัญหาให้เริ่มดู error ที่ <b>Manage app → Cloud logs</b>"
      }
    ]
  }
};

const TYPE_LABEL = { mcq: "แนวคิด", output: "อ่านโค้ด", bug: "หาจุดผิด" };
const LETTERS = ["ก", "ข", "ค", "ง"];
const STORE_KEY = "aai-review-v1";
const THEME_KEY = "aai-review-theme";

// ===================== Storage (ป้องกันกรณี localStorage ใช้ไม่ได้) =====================
function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveStore() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* ignore */ }
}
let store = loadStore();

// ===================== Helpers =====================
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const TOKEN_RE = /(#.*$|--.*$)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(@[\w.]+)|\b(def|return|if|not|in|for|import|from|as|with|True|False|None|del|and|or|else|GRANT|SELECT|ON|TABLE|TO)\b|\b(\d+(?:\.\d+)?)\b/gm;

function highlight(src) {
  let out = "", last = 0;
  src.replace(TOKEN_RE, (m, com, str, dec, kw, num, idx) => {
    out += escapeHtml(src.slice(last, idx));
    const cls = com ? "t-com" : str ? "t-str" : dec ? "t-dec" : kw ? "t-kw" : "t-num";
    out += `<span class="${cls}">${escapeHtml(m)}</span>`;
    last = idx + m.length;
    return m;
  });
  return out + escapeHtml(src.slice(last));
}

function scoreOf(lessonId) {
  const answers = store[lessonId] || {};
  const qs = LESSONS[lessonId].questions;
  let correct = 0, answered = 0;
  for (const q of qs) {
    if (answers[q.id] !== undefined) {
      answered++;
      if (answers[q.id] === q.answer) correct++;
    }
  }
  return { correct, answered, total: qs.length };
}

// ===================== Quiz rendering =====================
const order = {}; // ลำดับที่สุ่มแล้วของแต่ละบท

function buildOrder(lessonId) {
  order[lessonId] = shuffle(LESSONS[lessonId].questions).map(q => ({
    q,
    opts: shuffle(q.options.map((text, i) => ({ text, i })))
  }));
}

function renderQuiz(lessonId) {
  const root = document.querySelector(`[data-quiz="${lessonId}"]`);
  if (!order[lessonId]) buildOrder(lessonId);
  const answers = store[lessonId] || {};
  const s = scoreOf(lessonId);

  let html = `
    <div class="quiz-bar">
      <div class="quiz-score">ได้ ${s.correct} / ${s.total} <span>(ตอบแล้ว ${s.answered} ข้อ)</span></div>
      <button class="btn" type="button" data-restart="${lessonId}">เริ่มใหม่ + สุ่มลำดับ</button>
    </div>`;

  order[lessonId].forEach(({ q, opts }, n) => {
    const chosen = answers[q.id];
    const done = chosen !== undefined;
    html += `<div class="q" id="${q.id}">
      <div class="q-head"><span class="q-num">ข้อ ${n + 1}</span><span class="q-type">${TYPE_LABEL[q.type]}</span></div>
      <p class="q-text">${q.q}</p>
      ${q.code ? `<pre><code>${highlight(q.code)}</code></pre>` : ""}
      <div class="opts">`;
    opts.forEach((o, k) => {
      let cls = "opt";
      if (done) {
        if (o.i === q.answer) cls += " correct";
        else if (o.i === chosen) cls += " wrong";
        else cls += " dim";
      }
      const text = o.text.includes("\n")
        ? `<code style="white-space:pre">${escapeHtml(o.text)}</code>`
        : escapeHtml(o.text);
      html += `<button class="${cls}" type="button" data-lesson="${lessonId}" data-q="${q.id}" data-opt="${o.i}" ${done ? "disabled" : ""}>
        <span class="opt-letter">${LETTERS[k]}</span><span>${text}</span></button>`;
    });
    html += `</div>`;
    if (done) {
      const ok = chosen === q.answer;
      html += `<div class="explain"><b class="${ok ? "ok" : "bad"}">${ok ? "✓ ถูกต้อง" : "✗ ยังไม่ถูก"}</b> · ${q.explain}</div>`;
    }
    html += `</div>`;
  });

  if (s.answered === s.total) {
    const pct = Math.round((s.correct / s.total) * 100);
    const msg = pct >= 80 ? "พร้อมสอบบทนี้แล้ว" : pct >= 50 ? "ทบทวนข้อที่ผิดอีกนิด" : "ลองกลับไปอ่านสรุปอีกรอบ";
    html += `<div class="done-banner"><strong>${s.correct} / ${s.total}</strong>${msg}</div>`;
  }

  root.innerHTML = html;
  updateBadges();
}

function updateBadges() {
  for (const id of Object.keys(LESSONS)) {
    const s = scoreOf(id);
    const el = document.querySelector(`[data-badge="${id}"]`);
    if (el) el.textContent = s.answered ? `${s.correct}/${s.total}` : "";
  }
  renderProgress();
}

function renderProgress() {
  const grid = document.getElementById("progressGrid");
  grid.innerHTML = Object.entries(LESSONS).map(([id, l]) => {
    const s = scoreOf(id);
    const wrong = s.answered - s.correct;
    return `<div class="progress-card">
      <a class="pc-head" href="#${id}" data-goto="${id}" data-view="summary">
        <div class="pc-week">${l.week}</div>
        <div class="pc-title">${l.title}</div>
      </a>
      <div class="pc-foot">
        <div class="pc-score">${s.correct}<small> / ${s.total} ถูก</small></div>
        <button class="btn" type="button" data-goto="${id}" data-view="quiz">ทำข้อสอบ →</button>
      </div>
      <div class="bar"><i class="b-ok" style="width:${s.correct * 10}%"></i><i class="b-bad" style="width:${wrong * 10}%"></i></div>
    </div>`;
  }).join("");
}

// ===================== Navigation =====================
function showPanel(id, view) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.target === id));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === id));
  if (view) setView(document.getElementById(id), view);
  window.scrollTo({ top: 0 });
}

function setView(panel, view) {
  panel.querySelectorAll(".subtab").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  panel.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.classList.contains(view)));
}

document.addEventListener("click", e => {
  const tab = e.target.closest(".tab");
  if (tab) return showPanel(tab.dataset.target);

  const sub = e.target.closest(".subtab");
  if (sub) return setView(sub.closest(".panel"), sub.dataset.view);

  const link = e.target.closest("[data-goto]");
  if (link) {
    e.preventDefault();
    return showPanel(link.dataset.goto, link.dataset.view);
  }

  const opt = e.target.closest(".opt");
  if (opt && !opt.disabled) {
    const { lesson, q } = opt.dataset;
    store[lesson] = store[lesson] || {};
    store[lesson][q] = Number(opt.dataset.opt);
    saveStore();
    const y = window.scrollY;
    renderQuiz(lesson);
    window.scrollTo({ top: y });
    return;
  }

  const restart = e.target.closest("[data-restart]");
  if (restart) {
    const id = restart.dataset.restart;
    delete store[id];
    saveStore();
    buildOrder(id);
    renderQuiz(id);
    restart.closest(".panel").scrollIntoView();
    return;
  }

  if (e.target.closest("#resetAll")) {
    if (confirm("ล้างคะแนนทุกบท?")) {
      store = {};
      saveStore();
      Object.keys(LESSONS).forEach(id => { buildOrder(id); renderQuiz(id); });
    }
  }
});

// ===================== Theme =====================
function applyTheme(t) {
  if (t) document.documentElement.dataset.theme = t;
}
function currentTheme() {
  return document.documentElement.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
try { applyTheme(localStorage.getItem(THEME_KEY)); } catch { /* ignore */ }
if (!document.documentElement.dataset.theme) applyTheme(currentTheme());

document.getElementById("themeToggle").addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
});

// ===================== Init =====================
document.querySelectorAll(".summary pre code").forEach(el => {
  el.innerHTML = highlight(el.textContent);
});
Object.keys(LESSONS).forEach(renderQuiz);
