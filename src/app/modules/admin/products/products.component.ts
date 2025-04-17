import { withInterceptorsFromDi } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/service';
declare var bootstrap: any; // Declare Bootstrap API

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @ViewChild('addProductModal') modalRef: any;

  products: any[] = [];
  selectedFile: any;
  localImageUrl!: string;
  selectedCategory: string = '';
  addProductForm!: FormGroup;
  operation: string ='ADD';

  // list of categories to show in dropdown
  categories = [
    { label: 'Flagship Phones', value: 'flagshipPhones' },
    { label: 'Budget Phones', value: 'budgetPhones' },
    { label: 'Mid-Range Phones', value: 'midRangePhones' },
    { label: 'Gaming Phones', value: 'gamingPhones' },

    { label: 'Foldable Phones', value: 'foldablePhones' },
    { label: 'Camera Phones', value: 'cameraPhones' },
    { label: '5G Phones', value: '5GPhones' },
    { label: 'Battery Phones', value: 'batteryPhones' },
    { label: 'Refurbished Phones', value: 'refurbishedPhones' },
    { label: 'Dual SIM Phones', value: 'dualSIMPhones' }
  ];
  currentIndex!: any;


  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // Initialize the form with FormBuilder
    this.addProductForm = this.fb.group({
      productImage: [null, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(1)]],

      inTheBox: ['', Validators.required],
      modelNumber: ['', Validators.required],
      modelName: ['', Validators.required],
      color: ['', Validators.required],
      browseType: ['', Validators.required],
      simType: ['', Validators.required],
      hybridSimSlot: ['', Validators.required],
      touchscreen: ['', Validators.required],
      otgCompatible: ['', Validators.required],
      quickCharging: ['', Validators.required],

      displaySize: ['', Validators.required],
      resolution: ['', Validators.required],
      resolutionType: ['', Validators.required],
      displayColors: ['', Validators.required],
      otherDisplayFeatures: ['', Validators.required],

      operatingSystem: ['', Validators.required],
      processorBrand: ['', Validators.required],
      processorType: ['', Validators.required],
      operatingFrequency: ['', Validators.required],
      internalStorage: ['', Validators.required],
      ram: ['', Validators.required],
      totalMemory: ['', Validators.required],


      smartphone: ['', Validators.required],
      simSize: ['', Validators.required],
      voiceInput: ['', Validators.required],
      graphicsPpi: ['', Validators.required],
      sensors: ['', Validators.required],

      batteryCapacity: ['', Validators.required],

      width: ['', Validators.required],
      height: ['', Validators.required],
      depth: ['', Validators.required],
      weight: ['', Validators.required],

      warrantySummary: ['', Validators.required],
      domesticWarranty: ['', Validators.required],

      primaryCameraAvailable: ['', Validators.required],
      primaryCamera: ['', Validators.required],
      primaryCameraFeatures: ['', Validators.required],
      opticalZoom: ['', Validators.required],
      secondaryCameraAvailable: ['', Validators.required],
      secondaryCamera: ['', Validators.required],
      flash: ['', Validators.required],
      videoRecordingResolution: ['', Validators.required],
      digitalZoom: ['', Validators.required],
      frameRate: ['', Validators.required],
      imageEditor: ['', Validators.required],
      dualCameraLens: ['', Validators.required],

      networkType: ['', Validators.required],
      supportedNetworks: ['', Validators.required],
      bluetoothSupport: ['', Validators.required],
      bluetoothVersion: ['', Validators.required],
      wiFi: ['', Validators.required],
      wifiHotspot: ['', Validators.required],
      nfc: ['', Validators.required],
      usbConnectivity: ['', Validators.required],
    });
    this.getProducts();

  }


  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   this.addProductForm.patchValue({
  //     productImage: file
  //   });
  // }

  closeModal() {
    const cancelBtn = document.querySelector('[data-bs-dismiss="modal"]');
    if (cancelBtn) {
      cancelBtn.dispatchEvent(new MouseEvent('click'));  // Trigger the dismiss event
    }
  }

  newProduct = { image_url: '', name: '', description: '', category: '', price: 0, stock: 1 };

  updateCategory(event: any) {
    this.newProduct.category = event.target.value;
  }

  addProduct() {
    console.log(this.addProductForm.value);
    if (this.addProductForm.valid) {
      // Extract form values and prepare the product data
      const productData = {
        name: this.addProductForm.get('name')?.value,
        description: this.addProductForm.get('description')?.value,
        price: this.addProductForm.get('price')?.value,
        category: this.addProductForm.get('category')?.value,
        stock: this.addProductForm.get('stock')?.value,
        image_url: this.newProduct.image_url, // Use the image URL from the uploaded file
        additionalJson: this.addProductForm.value
      }

      // Check if required fields are filled
      if (productData.name && productData.price > 0 && productData.stock > 0 && productData.image_url && productData.category) {
        this.apiService.addProduct(productData).subscribe(
          (response) => {
            // alert('Product added successfully!');
            this.getProducts(); // Refresh the product list after adding
            this.addProductForm.reset(); // Reset the form after submission
            this.closeModal()
          },
          (error) => {
            alert('Failed to add product.');
            console.error(error);
          }
        );
      } else {
        alert('Please fill in all fields.');
      }
    } else {
      alert('Form is invalid. Please fill in all required fields.');
    }
  }


  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Create FormData to send file
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // Upload image_url to backend
      this.apiService.uploadImage(formData).subscribe(
        (response: any) => {
          this.newProduct.image_url = response.imageUrl; // Store the returned file path in DB
          this.addProductForm.patchValue({
            productImage: response.imageUrl // Assuming the backend returns imageUrl
          });
        },
        (error) => {
          console.error('image_url upload failed', error);
        }
      );
    }
  }

  // method to get products from backend
  getProducts() {
    this.apiService.getProducts().subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {

        console.error('Failed to fetch products', error);
      }
    );
  }


  removeProduct(index: number, productId: any) {
    // api to remove product
    this.apiService.removeProduct(this.products[index].id).subscribe(
      (response) => {
        this.products.splice(index, 1); // Remove the product from the array
        this.toastr.success('Product removed successfully!', 'Success');
      },
      (error) => {
        console.error('Failed to remove product', error);
        alert('Failed to remove product');
      }
    );
  }

  // method to update product
  updateProduct() {
    const index = this.currentIndex;
  
    const updatedProduct = this.products[index];
    if (this.addProductForm.valid) {
      const productData = {
        name: this.addProductForm.get('name')?.value,
        description: this.addProductForm.get('description')?.value,
        price: this.addProductForm.get('price')?.value,
        category: this.addProductForm.get('category')?.value,
        stock: this.addProductForm.get('stock')?.value,
        image_url: this.newProduct.image_url, // Use the image URL from the uploaded file
        additionalJson: this.addProductForm.value
      }
      console.log(updatedProduct);
      this.apiService.updateProduct(this.currentIndex, productData).subscribe(
        (response) => {
          // alert('Product updated successfully!');
          // toster message
          this.getProducts(); // Refresh the product list after updating
          this.closeModal()     
          this.toastr.success('Product updated successfully!', 'Success');
        },
        (error) => {
          console.error('Failed to update product', error);
          alert('Failed to update product');
        }
      );
    }
  }

  editProduct(product_id: number) {
    this.currentIndex = product_id;
    this.operation =  'EDIT';
    const product = this.products.find((p) => p.id === product_id);
    if (product) {
    this.addProductForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      productImage: product.image_url,

      inTheBox: product.additionalJson?.inTheBox,
      modelNumber: product.additionalJson?.modelNumber,
      modelName: product.additionalJson?.modelName,
      color: product.additionalJson?.color,
      browseType: product.additionalJson?.browseType,
      simType: product.additionalJson?.simType,
      hybridSimSlot: product.additionalJson?.hybridSimSlot,
      touchscreen: product.additionalJson?.touchscreen,
      otgCompatible: product.additionalJson?.otgCompatible,
      quickCharging: product.additionalJson?.quickCharging,
      displaySize: product.additionalJson?.displaySize,
      resolution: product.additionalJson?.resolution,
      resolutionType: product.additionalJson?.resolutionType,
      displayColors: product.additionalJson?.displayColors,
      otherDisplayFeatures: product.additionalJson?.otherDisplayFeatures,
      operatingSystem: product.additionalJson?.operatingSystem,
      processorBrand: product.additionalJson?.processorBrand,
      processorType: product.additionalJson?.processorType,
      operatingFrequency: product.additionalJson?.operatingFrequency,
      internalStorage: product.additionalJson?.internalStorage,
      ram: product.additionalJson?.ram,
      totalMemory: product.additionalJson?.totalMemory,
      smartphone: product.additionalJson?.smartphone,
      simSize: product.additionalJson?.simSize,
      voiceInput: product.additionalJson?.voiceInput,
      graphicsPpi: product.additionalJson?.graphicsPpi,
      sensors: product.additionalJson?.sensors,
      batteryCapacity: product.additionalJson?.batteryCapacity,
      width: product.additionalJson?.width,
      height: product.additionalJson?.height,
      depth: product.additionalJson?.depth,
      weight: product.additionalJson?.weight,
      warrantySummary: product.additionalJson?.warrantySummary,
      domesticWarranty: product.additionalJson?.domesticWarranty,
      primaryCameraAvailable: product.additionalJson?.primaryCameraAvailable,
      primaryCamera: product.additionalJson?.primaryCamera,
      primaryCameraFeatures: product.additionalJson?.primaryCameraFeatures,
      opticalZoom: product.additionalJson?.opticalZoom,
      secondaryCameraAvailable: product.additionalJson?.secondaryCameraAvailable,
      secondaryCamera: product.additionalJson?.secondaryCamera,
      flash: product.additionalJson?.flash,
      videoRecordingResolution: product.additionalJson?.videoRecordingResolution,
      digitalZoom: product.additionalJson?.digitalZoom,
      frameRate: product.additionalJson?.frameRate,
      imageEditor: product.additionalJson?.imageEditor,
      dualCameraLens: product.additionalJson?.dualCameraLens,
      networkType: product.additionalJson?.networkType,
      supportedNetworks: product.additionalJson?.supportedNetworks,
      bluetoothSupport: product.additionalJson?.bluetoothSupport,
      bluetoothVersion: product.additionalJson?.bluetoothVersion,
      wiFi: product.additionalJson?.wiFi,
      wifiHotspot: product.additionalJson?.wifiHotspot,
      nfc: product.additionalJson?.nfc,
      usbConnectivity: product.additionalJson?.usbConnectivity,  
    });
    this.addProductForm.patchValue({
      productImage: product.image_url // Assuming the backend returns imageUrl
    });
  }
  }

}
function ngOninit() {
  throw new Error('Function not implemented.');
}

