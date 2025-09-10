# Bài 4: Linked Lists - Danh sách liên kết

## 1. Giới thiệu về Linked Lists

<div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
  <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Định nghĩa</h3>
  <p className="text-blue-700">Linked List là một cấu trúc dữ liệu tuyến tính trong đó các phần tử được lưu trữ trong các node, mỗi node chứa dữ liệu và một con trỏ (pointer) trỏ đến node tiếp theo.</p>
</div>

### Đặc điểm chính:

- **Bộ nhớ không liền kề**: Các node có thể nằm ở bất kỳ vị trí nào trong bộ nhớ
- **Kích thước linh hoạt**: Có thể thay đổi kích thước trong quá trình chạy
- **Truy cập tuần tự**: Phải duyệt từ node đầu đến node cần truy cập

## 2. Cấu trúc Node

```mermaid
graph LR
    A[data | next] --> B[data | next] --> C[data | NULL]
    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#e1f5fe
```

### Cài đặt Node trong C++:

```cpp
struct Node {
    int data;      // Dữ liệu của node
    Node* next;    // Con trỏ trỏ đến node tiếp theo

    // Constructor
    Node(int value) : data(value), next(nullptr) {}
};
```

## 3. So sánh Array vs Linked List

| Tiêu chí                | Array        | Linked List    |
| ----------------------- | ------------ | -------------- |
| **Bộ nhớ**              | Liền kề      | Rải rác        |
| **Truy cập ngẫu nhiên** | O(1)         | O(n)           |
| **Chèn/Xóa đầu**        | O(n)         | O(1)           |
| **Chèn/Xóa cuối**       | O(1)         | O(n)           |
| **Sử dụng bộ nhớ**      | Chỉ lưu data | Data + pointer |
| **Cache performance**   | Tốt          | Kém            |

## 4. Singly Linked List

<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
  <h3 className="text-green-800 font-semibold mb-3">🔗 Singly Linked List</h3>
  <p className="text-green-700">Mỗi node chỉ có một con trỏ next trỏ đến node tiếp theo. Node cuối cùng có next = nullptr.</p>
</div>

```mermaid
graph LR
    head[HEAD] --> A[10 | •] --> B[20 | •] --> C[30 | •] --> D[NULL]
    style head fill:#ffcdd2
    style A fill:#c8e6c9
    style B fill:#c8e6c9
    style C fill:#c8e6c9
```

### Cài đặt Singly Linked List:

```cpp
class SinglyLinkedList {
private:
    Node* head;
    int size;

public:
    // Constructor
    SinglyLinkedList() : head(nullptr), size(0) {}

    // Destructor
    ~SinglyLinkedList() {
        clear();
    }

    // Chèn node vào đầu danh sách - O(1)
    void insertAtHead(int value) {
        Node* newNode = new Node(value);
        newNode->next = head;
        head = newNode;
        size++;
    }

    // Chèn node vào cuối danh sách - O(n)
    void insertAtTail(int value) {
        Node* newNode = new Node(value);

        if (head == nullptr) {
            head = newNode;
        } else {
            Node* temp = head;
            while (temp->next != nullptr) {
                temp = temp->next;
            }
            temp->next = newNode;
        }
        size++;
    }

    // Chèn node tại vị trí index - O(n)
    bool insertAt(int index, int value) {
        if (index < 0 || index > size) return false;

        if (index == 0) {
            insertAtHead(value);
            return true;
        }

        Node* newNode = new Node(value);
        Node* temp = head;

        for (int i = 0; i < index - 1; i++) {
            temp = temp->next;
        }

        newNode->next = temp->next;
        temp->next = newNode;
        size++;
        return true;
    }

    // Xóa node đầu danh sách - O(1)
    bool deleteHead() {
        if (head == nullptr) return false;

        Node* temp = head;
        head = head->next;
        delete temp;
        size--;
        return true;
    }

    // Xóa node có giá trị value - O(n)
    bool deleteValue(int value) {
        if (head == nullptr) return false;

        // Nếu node đầu chứa giá trị cần xóa
        if (head->data == value) {
            return deleteHead();
        }

        Node* current = head;
        while (current->next != nullptr) {
            if (current->next->data == value) {
                Node* temp = current->next;
                current->next = temp->next;
                delete temp;
                size--;
                return true;
            }
            current = current->next;
        }
        return false;
    }

    // Tìm kiếm giá trị - O(n)
    int search(int value) {
        Node* temp = head;
        int index = 0;

        while (temp != nullptr) {
            if (temp->data == value) {
                return index;
            }
            temp = temp->next;
            index++;
        }
        return -1; // Không tìm thấy
    }

    // In danh sách
    void display() {
        Node* temp = head;
        while (temp != nullptr) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "NULL" << endl;
    }

    // Lấy kích thước
    int getSize() const { return size; }

    // Kiểm tra rỗng
    bool isEmpty() const { return head == nullptr; }

    // Xóa toàn bộ danh sách
    void clear() {
        while (head != nullptr) {
            deleteHead();
        }
    }
};
```

## 5. Doubly Linked List

<div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
  <h3 className="text-purple-800 font-semibold mb-3">🔗 Doubly Linked List</h3>
  <p className="text-purple-700">Mỗi node có hai con trỏ: prev trỏ về node trước và next trỏ đến node sau. Cho phép duyệt theo cả hai hướng.</p>
</div>

```mermaid
graph LR
    head[HEAD] -.-> A
    A[• | 10 | •] <--> B[• | 20 | •] <--> C[• | 30 | •]
    C -.-> tail[TAIL]
    style head fill:#ffcdd2
    style tail fill:#ffcdd2
    style A fill:#e1bee7
    style B fill:#e1bee7
    style C fill:#e1bee7
```

### Cài đặt Node cho Doubly Linked List:

```cpp
struct DoublyNode {
    int data;
    DoublyNode* prev;
    DoublyNode* next;

    DoublyNode(int value) : data(value), prev(nullptr), next(nullptr) {}
};
```

### Cài đặt Doubly Linked List:

```cpp
class DoublyLinkedList {
private:
    DoublyNode* head;
    DoublyNode* tail;
    int size;

public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {}

    // Chèn vào đầu - O(1)
    void insertAtHead(int value) {
        DoublyNode* newNode = new DoublyNode(value);

        if (head == nullptr) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }
        size++;
    }

    // Chèn vào cuối - O(1)
    void insertAtTail(int value) {
        DoublyNode* newNode = new DoublyNode(value);

        if (tail == nullptr) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
        size++;
    }

    // Xóa node đầu - O(1)
    bool deleteHead() {
        if (head == nullptr) return false;

        if (head == tail) {
            delete head;
            head = tail = nullptr;
        } else {
            DoublyNode* temp = head;
            head = head->next;
            head->prev = nullptr;
            delete temp;
        }
        size--;
        return true;
    }

    // Xóa node cuối - O(1)
    bool deleteTail() {
        if (tail == nullptr) return false;

        if (head == tail) {
            delete tail;
            head = tail = nullptr;
        } else {
            DoublyNode* temp = tail;
            tail = tail->prev;
            tail->next = nullptr;
            delete temp;
        }
        size--;
        return true;
    }

    // Duyệt từ đầu đến cuối
    void displayForward() {
        DoublyNode* temp = head;
        while (temp != nullptr) {
            cout << temp->data << " <-> ";
            temp = temp->next;
        }
        cout << "NULL" << endl;
    }

    // Duyệt từ cuối về đầu
    void displayBackward() {
        DoublyNode* temp = tail;
        while (temp != nullptr) {
            cout << temp->data << " <-> ";
            temp = temp->prev;
        }
        cout << "NULL" << endl;
    }
};
```

## 6. Circular Linked List

<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
  <h3 className="text-orange-800 font-semibold mb-3">🔄 Circular Linked List</h3>
  <p className="text-orange-700">Node cuối cùng trỏ về node đầu tiên, tạo thành một vòng tròn. Không có node nào có next = nullptr.</p>
</div>

```mermaid
graph LR
    A[10 | •] --> B[20 | •] --> C[30 | •] --> A
    style A fill:#ffe0b2
    style B fill:#ffe0b2
    style C fill:#ffe0b2
```

## 7. Bảng tóm tắt độ phức tạp

| Thao tác             | Singly LL | Doubly LL | Array |
| -------------------- | --------- | --------- | ----- |
| **Truy cập phần tử** | O(n)      | O(n)      | O(1)  |
| **Tìm kiếm**         | O(n)      | O(n)      | O(n)  |
| **Chèn đầu**         | O(1)      | O(1)      | O(n)  |
| **Chèn cuối**        | O(n)      | O(1)      | O(1)  |
| **Chèn giữa**        | O(n)      | O(n)      | O(n)  |
| **Xóa đầu**          | O(1)      | O(1)      | O(n)  |
| **Xóa cuối**         | O(n)      | O(1)      | O(1)  |
| **Xóa giữa**         | O(n)      | O(1)\*    | O(n)  |

\*Với điều kiện đã có con trỏ đến node cần xóa

## 8. Ứng dụng thực tế

### Music Playlist (Doubly Linked List)

```cpp
struct Song {
    string title;
    string artist;
    Song* prev;
    Song* next;

    Song(string t, string a) : title(t), artist(a), prev(nullptr), next(nullptr) {}
};

class MusicPlaylist {
    Song* current;
    // Các method: play(), next(), previous(), addSong(), removeSong()
};
```

### Undo/Redo Functionality (Doubly Linked List)

```cpp
class UndoRedoSystem {
    DoublyNode* currentState;
    // Methods: performAction(), undo(), redo()
};
```

## 9. Bài tập LeetCode liên quan

<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <h3 className="text-red-800 font-semibold mb-3">🎯 Bài tập thực hành</h3>
  
| Độ khó | Problem | Link |
|--------|---------|------|
| Easy | 21. Merge Two Sorted Lists | https://leetcode.com/problems/merge-two-sorted-lists/ |
| Easy | 206. Reverse Linked List | https://leetcode.com/problems/reverse-linked-list/ |
| Easy | 83. Remove Duplicates from Sorted List | https://leetcode.com/problems/remove-duplicates-from-sorted-list/ |
| Medium | 2. Add Two Numbers | https://leetcode.com/problems/add-two-numbers/ |
| Medium | 19. Remove Nth Node From End of List | https://leetcode.com/problems/remove-nth-node-from-end-of-list/ |
| Medium | 143. Reorder List | https://leetcode.com/problems/reorder-list/ |
| Medium | 24. Swap Nodes in Pairs | https://leetcode.com/problems/swap-nodes-in-pairs/ |
| Hard | 25. Reverse Nodes in k-Group | https://leetcode.com/problems/reverse-nodes-in-k-group/ |

</div>

## 10. Kết luận

### Khi nào sử dụng Linked List:

- **Kích thước dữ liệu không biết trước** và thay đổi thường xuyên
- **Thao tác chèn/xóa ở đầu danh sách** nhiều
- **Không cần truy cập ngẫu nhiên** đến các phần tử
- **Cần tiết kiệm bộ nhớ** (không cần cấp phát trước)

### Khi nào không nên sử dụng:

- Cần **truy cập ngẫu nhiên** thường xuyên
- **Cache performance** quan trọng
- Bộ nhớ hạn chế (overhead của pointer)
- Cần **binary search** trên dữ liệu đã sắp xếp

<div className="bg-gray-100 border-l-4 border-gray-400 p-4 mt-6">
  <p className="text-gray-700 italic">💡 <strong>Tip:</strong> Trong thực tế, hãy cân nhắc sử dụng std::list (doubly linked) hoặc std::forward_list (singly linked) của C++ STL thay vì tự cài đặt, trừ khi cần customization đặc biệt.</p>
</div>
