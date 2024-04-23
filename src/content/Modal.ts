// class Modal {
//     public getModal() {
//         return document.getElementById('customModal');
//     }

//     public create() {
//         if (this.getModal()) return;
//         let modal = document.createElement('div');
//         modal.setAttribute('id', 'customModal');
//         modal.style.cssText = `
//             width: 300px;
//             height: 200px;
//             background-color: white;
//             position: fixed;
//             top: 50px;
//             left: 50px;
//             z-index: 1000;
//             border: 1px solid #ccc;
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//             border-radius: 4px;
//         `;
//         document.body.appendChild(modal);

//         this.setupListeners();
//     }

//     public destroy() {
//         const modal = this.getModal();
//         if (modal) {
//             modal.remove();
//         }
//     }

//     private setupListeners() {
//         const modal = this.getModal();
//         if (modal) {
//             modal.addEventListener(
//                 'mousedown',
//                 this.handleMouseDown.bind(this)
//             );
//             document.addEventListener(
//                 'mousemove',
//                 this.handleMouseMove.bind(this)
//             );
//             document.addEventListener('mouseup', this.handleMouseUp.bind(this));
//         }
//     }

//     private handleMouseDown(e: MouseEvent) {
//         const modal = this.getModal();
//         if (modal) {
//             modal.isDragging = true;
//             this.modalState.dragStartX = e.clientX - this.modal.offsetLeft;
//             this.modalState.dragStartY = e.clientY - this.modal.offsetTop;
//             this.modal.style.cursor = 'grabbing';
//         }
//     }

//     private handleMouseMove(e: MouseEvent) {
//         if (this.modal && this.modalState && this.modalState.isDragging) {
//             this.modal.style.left =
//                 e.clientX - this.modalState.dragStartX + 'px';
//             this.modal.style.top =
//                 e.clientY - this.modalState.dragStartY + 'px';
//         }
//     }

//     private handleMouseUp() {
//         if (this.modal && this.modalState) {
//             this.modalState.isDragging = false;
//             this.modal.style.cursor = 'grab';
//         }
//     }
// }

// export const Modal = ModalClass.getInstance();
