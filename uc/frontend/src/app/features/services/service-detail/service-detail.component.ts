import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ServiceService } from '@core/services/service.service';
import { BookingService } from '@core/services/booking.service';
import { AuthService } from '@core/services/auth.service';
import { Profile, Service } from '@core/models';
import { ProfileService } from '@core/services/profile.service';
import { environment } from '@environments/environment';

declare const google: any;

@Component({
  standalone: false,
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  
  service: Service | null = null;
  bookingForm: FormGroup;
  loading = true;
  submitting = false;
  isLoggedIn = false;
  selectedDate: Date | null = null;
  selectedTimeSlot: string | null = null;
  selectedTimeSlots: string[] = [];
  timeSlots: { start: string; end: string; display: string; value: string }[] = [];
  profileDetails: Profile | null = null;
  
  // Google Maps properties
  googleMapsLoaded = false;
  autocomplete: any = null;
  map: any = null;
  marker: any = null;
  showMap = false;
  private googleMapsLoading?: Promise<void>;

  // Autocomplete data (state -> cities -> pincodes)
  indiaLocations: {
    state: string;
    cities: { name: string; pincodes: string[] }[];
  }[] = [
    {
      state: 'Gujarat',
      cities: [
        {
          name: 'Ahmedabad',
          pincodes: ['380001', '380002', '380003', '380004', '380005', '380006', '380007', '380008']
        },
        {
          name: 'Surat',
          pincodes: ['395001', '395002', '395003', '395004', '395005']
        },
        {
          name: 'Vadodara',
          pincodes: ['390001', '390002', '390003', '390004', '390005']
        },
        {
          name: 'Rajkot',
          pincodes: ['360001', '360002', '360003', '360004', '360005']
        },
        {
          name: 'Bhavnagar',
          pincodes: ['364001', '364002', '364003']
        },
        {
          name: 'Jamnagar',
          pincodes: ['361001', '361002', '361003']
        },
        {
          name: 'Junagadh',
          pincodes: ['362001', '362002']
        },
        {
          name: 'Anand',
          pincodes: ['388001', '388002']
        },
        {
          name: 'Nadiad',
          pincodes: ['387001', '387002']
        }
      ]
    },
    {
      state: 'Maharashtra',
      cities: [
        {
          name: 'Mumbai',
          pincodes: ['400001', '400002', '400003', '400004', '400005', '400006', '400007', '400008']
        },
        {
          name: 'Pune',
          pincodes: ['411001', '411002', '411003', '411004', '411005']
        },
        {
          name: 'Nashik',
          pincodes: ['422001', '422002', '422003']
        },
        {
          name: 'Nagpur',
          pincodes: ['440001', '440002', '440003']
        },
        {
          name: 'Thane',
          pincodes: ['400601', '400602', '400603']
        }
      ]
    },
    {
      state: 'Delhi',
      cities: [
        {
          name: 'New Delhi',
          pincodes: ['110001', '110002', '110003', '110004', '110005', '110006']
        }
      ]
    },
    {
      state: 'Karnataka',
      cities: [
        {
          name: 'Bangalore',
          pincodes: ['560001', '560002', '560003', '560004', '560005']
        },
        {
          name: 'Mysore',
          pincodes: ['570001', '570002']
        }
      ]
    },
    {
      state: 'Tamil Nadu',
      cities: [
        {
          name: 'Chennai',
          pincodes: ['600001', '600002', '600003', '600004', '600005']
        },
        {
          name: 'Coimbatore',
          pincodes: ['641001', '641002', '641003']
        }
      ]
    },
    {
      state: 'West Bengal',
      cities: [
        {
          name: 'Kolkata',
          pincodes: ['700001', '700002', '700003', '700004', '700005']
        },
        {
          name: 'Asansol',
          pincodes: ['713301', '713302']
        }
      ]
    },
    {
      state: 'Rajasthan',
      cities: [
        {
          name: 'Jaipur',
          pincodes: ['302001', '302002', '302003', '302004', '302005']
        },
        {
          name: 'Udaipur',
          pincodes: ['313001', '313002']
        }
      ]
    },
    {
      state: 'Telangana',
      cities: [
        {
          name: 'Hyderabad',
          pincodes: ['500001', '500002', '500003', '500004', '500005']
        },
        {
          name: 'Warangal',
          pincodes: ['506001', '506002']
        }
      ]
    },
    {
      state: 'Uttar Pradesh',
      cities: [
        {
          name: 'Lucknow',
          pincodes: ['226001', '226002', '226003']
        },
        {
          name: 'Kanpur',
          pincodes: ['208001', '208002', '208003']
        },
        {
          name: 'Varanasi',
          pincodes: ['221001', '221002']
        }
      ]
    }
  ];

  // Convenience flat lists for autocomplete
  states: string[] = this.indiaLocations.map(s => s.state);
  cities: string[] = this.indiaLocations.flatMap(s => s.cities.map(c => c.name));
  pincodes: string[] = [
    ...this.indiaLocations.flatMap(s => s.cities.flatMap(c => c.pincodes)),

    // Delhi NCR
    '110001', '110002', '110003', '110004', '110005', '110006', '110007', '110008', '110009', '110010',
    '110011', '110012', '110013', '110014', '110015', '110016', '110017', '110018', '110019', '110020',
    '110021', '110022', '110023', '110024', '110025', '110026', '110027', '110028', '110029', '110030',
    '110031', '110032', '110033', '110034', '110035', '110036', '110037', '110038', '110039', '110040',
    '110041', '110042', '110043', '110044', '110045', '110046', '110047', '110048', '110049', '110051',
    '110052', '110053', '110054', '110055', '110056', '110057', '110058', '110059', '110060', '110061',
    '110062', '110063', '110064', '110065', '110066', '110067', '110068', '110069', '110070', '110071',
    '110072', '110073', '110074', '110075', '110076', '110077', '110078', '110081', '110082', '110083',
    '110084', '110085', '110086', '110087', '110088', '110089', '110091', '110092', '110093', '110094',
    '110095', '110096', '122001', '122002', '122003', '122004', '122005', '122006', '122007', '122008',
    '122009', '122010', '122011', '122015', '122016', '122017', '122018', '201001', '201002', '201003',
    '201004', '201005', '201006', '201007', '201008', '201009', '201010', '201011', '201012', '201013',
    '201014', '201015', '201016', '201017', '201018', '201019', '201020', '201301', '201302', '201303',
    '201304', '201305', '201306', '201307', '201308', '201309', '201310', '201311', '201312', '201313',

    // Mumbai
    '400001', '400002', '400003', '400004', '400005', '400006', '400007', '400008', '400009', '400010',
    '400011', '400012', '400013', '400014', '400015', '400016', '400017', '400018', '400019', '400020',
    '400021', '400022', '400023', '400024', '400025', '400026', '400027', '400028', '400029', '400030',
    '400031', '400032', '400033', '400034', '400035', '400036', '400037', '400038', '400039', '400040',
    '400041', '400042', '400043', '400049', '400050', '400051', '400052', '400053', '400054', '400055',
    '400056', '400057', '400058', '400059', '400060', '400061', '400062', '400063', '400064', '400065',
    '400066', '400067', '400068', '400069', '400070', '400071', '400072', '400074', '400075', '400076',
    '400077', '400078', '400079', '400080', '400081', '400082', '400083', '400084', '400085', '400086',
    '400087', '400088', '400089', '400090', '400091', '400092', '400093', '400094', '400095', '400096',
    '400097', '400098', '400099', '400101', '400102', '400103', '400104', '400105', '400601', '400602',
    '400603', '400604', '400605', '400606', '400607', '400608', '400610', '400612', '400614', '400615',

    // Bangalore
    '560001', '560002', '560003', '560004', '560005', '560006', '560007', '560008', '560009', '560010',
    '560011', '560012', '560013', '560014', '560015', '560016', '560017', '560018', '560019', '560020',
    '560021', '560022', '560023', '560024', '560025', '560026', '560027', '560028', '560029', '560030',
    '560031', '560032', '560033', '560034', '560035', '560036', '560037', '560038', '560039', '560040',
    '560041', '560042', '560043', '560045', '560046', '560047', '560048', '560049', '560050', '560051',
    '560052', '560053', '560054', '560055', '560056', '560057', '560058', '560059', '560060', '560061',
    '560062', '560063', '560064', '560065', '560066', '560067', '560068', '560069', '560070', '560071',
    '560072', '560073', '560074', '560075', '560076', '560077', '560078', '560079', '560080', '560081',
    '560082', '560083', '560084', '560085', '560086', '560087', '560088', '560089', '560090', '560091',
    '560092', '560093', '560094', '560095', '560096', '560097', '560098', '560099', '560100', '560102',

    // Hyderabad
    '500001', '500002', '500003', '500004', '500005', '500006', '500007', '500008', '500009', '500010',
    '500011', '500012', '500013', '500014', '500015', '500016', '500017', '500018', '500020', '500022',
    '500023', '500024', '500025', '500026', '500027', '500028', '500029', '500030', '500031', '500032',
    '500033', '500034', '500035', '500036', '500038', '500039', '500040', '500041', '500042', '500044',
    '500045', '500046', '500047', '500048', '500049', '500050', '500051', '500052', '500053', '500054',
    '500055', '500056', '500057', '500058', '500059', '500060', '500061', '500062', '500063', '500064',
    '500065', '500066', '500067', '500068', '500069', '500070', '500071', '500072', '500073', '500074',
    '500075', '500076', '500077', '500078', '500079', '500080', '500081', '500082', '500083', '500084',
    '500085', '500086', '500087', '500088', '500089', '500090', '500091', '500092', '500093', '500094',
    '500095', '500096', '500097', '500098', '500099', '500100', '500101', '500102', '500103', '500104',

    // Ahmedabad
    '380001', '380002', '380003', '380004', '380005', '380006', '380007', '380008', '380009', '380010',
    '380011', '380012', '380013', '380014', '380015', '380016', '380017', '380018', '380019', '380020',
    '380021', '380022', '380023', '380024', '380025', '380026', '380027', '380028', '380029', '380030',
    '380031', '380050', '380051', '380052', '380053', '380054', '380055', '380056', '380057', '380058',
    '380059', '380060', '380061', '380063', '382001', '382002', '382003', '382004', '382005', '382006',

    // Chennai
    '600001', '600002', '600003', '600004', '600005', '600006', '600007', '600008', '600009', '600010',
    '600011', '600012', '600013', '600014', '600015', '600016', '600017', '600018', '600019', '600020',
    '600021', '600022', '600023', '600024', '600025', '600026', '600027', '600028', '600029', '600030',
    '600031', '600032', '600033', '600034', '600035', '600036', '600037', '600038', '600039', '600040',
    '600041', '600042', '600043', '600044', '600045', '600046', '600047', '600048', '600049', '600050',
    '600051', '600052', '600053', '600054', '600055', '600056', '600057', '600058', '600059', '600060',
    '600061', '600062', '600063', '600064', '600065', '600066', '600067', '600068', '600069', '600070',
    '600071', '600072', '600073', '600074', '600075', '600076', '600077', '600078', '600079', '600080',
    '600081', '600082', '600083', '600084', '600085', '600086', '600087', '600088', '600089', '600090',
    '600091', '600092', '600093', '600094', '600095', '600096', '600097', '600098', '600099', '600100',

    // Kolkata
    '700001', '700002', '700003', '700004', '700005', '700006', '700007', '700008', '700009', '700010',
    '700011', '700012', '700013', '700014', '700015', '700016', '700017', '700018', '700019', '700020',
    '700021', '700022', '700023', '700024', '700025', '700026', '700027', '700028', '700029', '700030',
    '700031', '700032', '700033', '700034', '700035', '700036', '700037', '700038', '700039', '700040',
    '700041', '700042', '700043', '700044', '700045', '700046', '700047', '700048', '700049', '700050',
    '700051', '700052', '700053', '700054', '700055', '700056', '700057', '700058', '700059', '700060',
    '700061', '700062', '700063', '700064', '700065', '700066', '700067', '700068', '700069', '700070',
    '700071', '700072', '700073', '700074', '700075', '700076', '700077', '700078', '700079', '700080',
    '700081', '700082', '700083', '700084', '700085', '700086', '700087', '700088', '700089', '700090',
    '700091', '700092', '700093', '700094', '700095', '700096', '700097', '700098', '700099', '700100',

    // Pune
    '411001', '411002', '411003', '411004', '411005', '411006', '411007', '411008', '411009', '411010',
    '411011', '411012', '411013', '411014', '411015', '411016', '411017', '411018', '411019', '411020',
    '411021', '411022', '411023', '411024', '411025', '411026', '411027', '411028', '411029', '411030',
    '411031', '411032', '411033', '411034', '411035', '411036', '411037', '411038', '411039', '411040',
    '411041', '411042', '411043', '411044', '411045', '411046', '411047', '411048', '411051', '411052',

    // Jaipur
    '302001', '302002', '302003', '302004', '302005', '302006', '302007', '302008', '302009', '302010',
    '302011', '302012', '302013', '302014', '302015', '302016', '302017', '302018', '302019', '302020',
    '302021', '302022', '302023', '302024', '302025', '302026', '302027', '302028', '302029', '302030',
    '302031', '302032', '302033', '302034', '302035', '302036', '302037', '302038', '302039', '302040',

    // Other major cities
    '226001', '226002', '226003', '226004', '226005', '208001', '208002', '208003', '208004', '208005',
    '440001', '440002', '440003', '440004', '440005', '452001', '452002', '452003', '452004', '452005',
    '462001', '462002', '462003', '462004', '462005', '530001', '530002', '530003', '530004', '530005',
    '800001', '800002', '800003', '800004', '800005', '390001', '390002', '390003', '390004', '390005',
    '395001', '395002', '395003', '395004', '395005', '141001', '141002', '141003', '141004', '141005',
    '282001', '282002', '282003', '282004', '282005', '422001', '422002', '422003', '422004', '422005',
    '121001', '121002', '121003', '121004', '121005', '250001', '250002', '250003', '250004', '250005',
    '360001', '360002', '360003', '360004', '360005', '190001', '190002', '190003', '190004', '190005',
    '431001', '431002', '431003', '431004', '431005', '144001', '144002', '144003', '144004', '144005',
    '211001', '211002', '211003', '211004', '211005', '834001', '834002', '834003', '834004', '834005',
    '711101', '711102', '711103', '711104', '711105', '641001', '641002', '641003', '641004', '641005',
    '482001', '482002', '482003', '482004', '482005', '474001', '474002', '474003', '474004', '474005',
    '520001', '520002', '520003', '520004', '520005', '342001', '342002', '342003', '342004', '342005',
    '625001', '625002', '625003', '625004', '625005', '492001', '492002', '492003', '492004', '492005',
    '324001', '324002', '324003', '324004', '324005', '160001', '160002', '160003', '160004', '160005',
    '781001', '781002', '781003', '781004', '781005', '413001', '413002', '413003', '413004', '413005'
  ];

  filteredStates!: Observable<string[]>;
  filteredCities!: Observable<string[]>;
  filteredPincodes!: Observable<string[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private bookingService: BookingService,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.bookingForm = this.fb.group({
      bookingFor: ['self', Validators.required],
      clientDetails: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
      }),
      scheduledDate: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      preferredTimeSlots: [[]],

      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        landmark: ['']
      }),
      paymentMethod: ['cash', Validators.required],
      notes: ['']
    });
    this.prefillClientDetailsFromAuthUser();
    this.generateTimeSlots();
    this.setupBookingForListener();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadService(id);
    }
    // Setup autocomplete filtering - COMMENTED OUT - Using Map-based address selection only
    // this.setupAutocomplete();

    if (this.isLoggedIn) {
      this.loadProfile();
    }
    
    // Load Google Maps
    this.loadGoogleMaps();
  }

  loadService(id: string): void {
    this.serviceService.getService(id).subscribe({
      next: (response: any) => {
        this.service = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Service not found');
        this.router.navigate(['/']);
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/600x400/6e45e2/ffffff?text=Service+Image';
  }

  generateTimeSlots(): void {
    // Generate time slots from 9 AM to 5 PM in 1.5-hour intervals
    const slots = [
      { start: '09:00', end: '10:30', display: '9:00 AM - 10:30 AM', value: '09:00' },
      { start: '10:30', end: '12:00', display: '10:30 AM - 12:00 PM', value: '10:30' },
      { start: '12:00', end: '13:30', display: '12:00 PM - 1:30 PM', value: '12:00' },
      { start: '13:30', end: '15:00', display: '1:30 PM - 3:00 PM', value: '13:30' },
      { start: '15:00', end: '16:30', display: '3:00 PM - 4:30 PM', value: '15:00' },
      { start: '16:30', end: '18:00', display: '4:30 PM - 6:00 PM', value: '16:30' }
    ];
    this.timeSlots = slots;
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
    this.selectedTimeSlot = null;
    this.selectedTimeSlots = []; // Reset selected time slots when date changes
    this.bookingForm.patchValue({
      scheduledDate: date.toISOString().split('T')[0],
      scheduledTime: '',
      preferredTimeSlots: []
    });
  }

  selectTimeSlot(slot: { start: string; end: string; display: string; value: string }): void {
    const index = this.selectedTimeSlots.indexOf(slot.value);
    
    if (index > -1) {
      // Slot already selected, remove it
      this.selectedTimeSlots.splice(index, 1);
    } else {
      // Add new slot
      this.selectedTimeSlots.push(slot.value);
    }

    // Update primary scheduledTime with first selected slot
    if (this.selectedTimeSlots.length > 0) {
      this.selectedTimeSlot = this.selectedTimeSlots[0];
      this.bookingForm.patchValue({
        scheduledTime: this.selectedTimeSlots[0],
        preferredTimeSlots: this.selectedTimeSlots
      });
    } else {
      this.selectedTimeSlot = null;
      this.bookingForm.patchValue({
        scheduledTime: '',
        preferredTimeSlots: []
      });
    }
  }

  isDateSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    return this.selectedDate.toDateString() === date.toDateString();
  }

  isTimeSlotSelected(slotValue: string): boolean {
    return this.selectedTimeSlots.includes(slotValue);
  }

  get minDate(): Date {
    return new Date(); // Today
  }

  /* COMMENTED OUT - Using Map-based address selection only
  setupAutocomplete(): void {
    const addressGroup = this.bookingForm.get('address')!;
    const stateControl = addressGroup.get('state')!;
    const cityControl = addressGroup.get('city')!;
    const pincodeControl = addressGroup.get('pincode')!;

    // State autocomplete (always from full state list)
    this.filteredStates = stateControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || ''))
    );

    // When state changes: reset city & pincode
    stateControl.valueChanges.subscribe(() => {
      cityControl.setValue('');
      pincodeControl.setValue('');
    });

    // City autocomplete depends on selected state
    this.filteredCities = cityControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCities(value || ''))
    );

    // When city changes: reset pincode
    cityControl.valueChanges.subscribe(() => {
      pincodeControl.setValue('');
    });

    // Pincode autocomplete depends on selected state + city
    this.filteredPincodes = pincodeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPincodes(value || ''))
    );
  }
  */

  private setupBookingForListener(): void {
    const bookingForControl = this.bookingForm.get('bookingFor');
    const addressGroup = this.bookingForm.get('address') as FormGroup;
    
    bookingForControl?.valueChanges.subscribe((value: 'self' | 'someone-else') => {
      if (value === 'self') {
        // Populate client details from profile
        this.populateClientDetailsFromProfile();
        
        // Populate address from profile
        this.populateAddressFromProfile();
        
        // Disable address fields for self booking (they'll be fetched from profile)
        addressGroup.disable();
        
        // Hide map for self booking
        this.showMap = false;
      } else {
        // For someone else - enable address fields and clear client details
        const clientDetailsGroup = this.bookingForm.get('clientDetails') as FormGroup;
        clientDetailsGroup.reset({
          name: '',
          email: '',
          phone: ''
        });
        clientDetailsGroup.markAsPristine();
        clientDetailsGroup.markAsUntouched();
        
        // Enable address fields
        addressGroup.enable();
        
        // Clear address
        addressGroup.reset({
          street: '',
          city: '',
          state: '',
          pincode: '',
          landmark: ''
        });
        
        // Reinitialize Google Maps autocomplete for someone else
        setTimeout(() => {
          if (this.googleMapsLoaded && this.addressInput) {
            this.initializeGoogleMaps();
          }
        }, 100);
      }
    });

    if (bookingForControl?.value === 'self') {
      this.populateClientDetailsFromProfile();
      this.populateAddressFromProfile();
      addressGroup.disable();
    }
  }

  private loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profileDetails = response.data;
          if (this.isSelfBooking) {
            this.populateClientDetailsFromProfile();
            this.populateAddressFromProfile();
          }
        }
      },
      error: () => {}
    });
  }

  private populateAddressFromProfile(): void {
    const addressGroup = this.bookingForm.get('address') as FormGroup;
    
    if (this.profileDetails?.address) {
      addressGroup.patchValue({
        street: this.profileDetails.address.street || '',
        city: this.profileDetails.address.city || '',
        state: this.profileDetails.address.state || '',
        pincode: this.profileDetails.address.zipCode || '',
        landmark: ''
      });
    }
  }

  private populateClientDetailsFromProfile(): void {
    const clientDetailsGroup = this.bookingForm.get('clientDetails') as FormGroup;
    const fallbackUser = this.authService.getCurrentUser();
    clientDetailsGroup.patchValue({
      name: this.profileDetails?.name || fallbackUser?.name || '',
      email: this.profileDetails?.email || fallbackUser?.email || '',
      phone: this.profileDetails?.phone || fallbackUser?.phone || ''
    });
  }

  private prefillClientDetailsFromAuthUser(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.bookingForm.get('clientDetails')?.patchValue({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone
      });
    }
  }

  get isSelfBooking(): boolean {
    return this.bookingForm.get('bookingFor')?.value === 'self';
  }

  /* COMMENTED OUT - Using Map-based address selection only
  private _filterStates(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.states
      .filter(state => state.toLowerCase().includes(filterValue))
      .slice(0, 10);
  }

  private _filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    const stateValue = (this.bookingForm.get('address.state')?.value || '').toLowerCase();

    let cities: string[];
    if (stateValue) {
      const stateEntry = this.indiaLocations.find(s => s.state.toLowerCase() === stateValue);
      cities = stateEntry ? stateEntry.cities.map(c => c.name) : this.cities;
    } else {
      cities = this.cities;
    }

    return cities
      .filter(city => city.toLowerCase().includes(filterValue))
      .slice(0, 10);
  }

  private _filterPincodes(value: string): string[] {
    const filterValue = value.toLowerCase();
    const stateValue = (this.bookingForm.get('address.state')?.value || '').toLowerCase();
    const cityValue = (this.bookingForm.get('address.city')?.value || '').toLowerCase();

    let pincodes: string[] = [];

    if (stateValue) {
      const stateEntry = this.indiaLocations.find(s => s.state.toLowerCase() === stateValue);
      if (stateEntry) {
        if (cityValue) {
          const cityEntry = stateEntry.cities.find(c => c.name.toLowerCase() === cityValue);
          pincodes = cityEntry ? cityEntry.pincodes : [];
        } else {
          pincodes = stateEntry.cities.flatMap(c => c.pincodes);
        }
      }
    }

    if (pincodes.length === 0) {
      pincodes = this.pincodes;
    }

    return pincodes
      .filter(pincode => pincode.toLowerCase().includes(filterValue))
      .slice(0, 10);
  }
  */

  bookService(): void {
    if (!this.isLoggedIn) {
      alert('Please login to book a service');
      this.router.navigate(['/auth/login']);
      return;
    }

    // Check if booking for self and profile address is missing
    if (this.isSelfBooking) {
      const hasAddress = this.profileDetails?.address?.street && 
                        this.profileDetails?.address?.city && 
                        this.profileDetails?.address?.state && 
                        this.profileDetails?.address?.zipCode;
      
      if (!hasAddress) {
        if (confirm('Your profile address is incomplete. You need to complete your profile before booking for yourself. Would you like to go to your profile page now?')) {
          // Navigate to profile with return URL
          this.router.navigate(['/profile'], { 
            queryParams: { returnUrl: this.router.url } 
          });
        }
        return;
      }
    }

    if (!this.selectedDate || this.selectedTimeSlots.length === 0) {
      alert('Please select date and at least one preferred time slot');
      return;
    }

    if (this.bookingForm.valid && this.service) {
      this.submitting = true;
      
      // Re-enable address group temporarily to get values if it was disabled
      const addressGroup = this.bookingForm.get('address') as FormGroup;
      const wasDisabled = addressGroup.disabled;
      if (wasDisabled) {
        addressGroup.enable();
      }
      
      const bookingData = {
        service: this.service._id,
        ...this.bookingForm.value
      };
      
      // Disable again if it was disabled
      if (wasDisabled) {
        addressGroup.disable();
      }

      this.bookingService.createBooking(bookingData).subscribe({
        next: () => {
          alert('Booking created successfully!');
          this.router.navigate(['/bookings']);
        },
        error: (error) => {
          alert('Error creating booking: ' + error.message);
          this.submitting = false;
        }
      });
    } else {
      alert('Please fill all required fields correctly');
    }
  }

  getDiscountPercentage(): number {
    if (this.service?.discountPrice && this.service.price) {
      return Math.round(((this.service.price - this.service.discountPrice) / this.service.price) * 100);
    }
    return 0;
  }

  // Google Maps Functions
  loadGoogleMaps(): void {
    // Already loaded
    if (typeof google !== 'undefined' && google.maps) {
      this.googleMapsLoaded = true;
      return;
    }

    // Already loading
    if (this.googleMapsLoading) return;

    if (!environment.googleMapsApiKey) {
      console.info('Google Maps API key not configured');
      return;
    }

    this.googleMapsLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.googleMapsLoaded = true;
        resolve();
        if (this.addressInput) {
          setTimeout(() => this.initializeGoogleMaps(), 300);
        }
      };

      script.onerror = () => {
        this.googleMapsLoaded = false;
        reject();
      };

      document.head.appendChild(script);
    });
  }

  initializeGoogleMaps(): void {
    if (!this.addressInput || !this.googleMapsLoaded || this.isSelfBooking) return;

    try {
      // Initialize Autocomplete
      this.autocomplete = new google.maps.places.Autocomplete(
        this.addressInput.nativeElement,
        {
          types: ['address'],
          fields: ['address_components', 'geometry', 'formatted_address']
        }
      );

      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete!.getPlace();
        if (place.geometry && place.geometry.location) {
          this.updateAddressFromPlace(place);
        }
      });
    } catch (error) {
      console.error('Google Maps initialization error:', error);
    }
  }

  updateAddressFromPlace(place: any): void {
    const addressComponents = place.address_components || [];
    let street = '';
    let city = '';
    let state = '';
    let pincode = '';
    let sublocality = '';
    let administrative_area_2 = '';

    console.log('Place received:', place);
    console.log('Address components:', addressComponents);

    addressComponents.forEach((component: any) => {
      const types = component.types;
      
      // Street number and route
      if (types.includes('street_number')) {
        street = component.long_name + ' ';
      }
      if (types.includes('route')) {
        street += component.long_name;
      }
      
      // City - try multiple location types with priority
      if (types.includes('locality')) {
        city = component.long_name;
      }
      if (types.includes('administrative_area_level_2')) {
        administrative_area_2 = component.long_name;
      }
      if (types.includes('sublocality_level_1')) {
        sublocality = component.long_name;
      }
      if (types.includes('sublocality')) {
        if (!sublocality) sublocality = component.long_name;
      }
      
      // State
      if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      
      // Pincode/Postal code
      if (types.includes('postal_code')) {
        pincode = component.long_name;
      }
    });

    // Determine best city value with fallbacks
    if (!city) {
      city = administrative_area_2 || sublocality || '';
    }

    // If street is empty, use formatted address first part
    if (!street.trim() && place.formatted_address) {
      const addressParts = place.formatted_address.split(',');
      street = addressParts[0]?.trim() || '';
    }

    const extractedAddress = {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      landmark: this.bookingForm.get('address.landmark')?.value || ''
    };

    console.log('Extracted address:', extractedAddress);

    // Update the form with all extracted address components
    const addressGroup = this.bookingForm.get('address') as FormGroup;
    if (addressGroup) {
      addressGroup.patchValue(extractedAddress, { emitEvent: true });
      
      // Mark fields as touched to show they have been filled
      Object.keys(addressGroup.controls).forEach(key => {
        addressGroup.get(key)?.markAsTouched();
      });
    }

    // Update map if visible
    if (this.showMap && place.geometry?.location) {
      this.updateMapLocation(place.geometry.location);
    }
  }

  toggleMap(): void {
    if (!this.googleMapsLoaded) {
      alert('Google Maps is not available. Map features require API key configuration.');
      return;
    }
    
    if (this.isSelfBooking) {
      alert('Map is only available when booking for someone else. Your address is fetched from your profile.');
      return;
    }
    
    this.showMap = !this.showMap;
    
    if (this.showMap && !this.map) {
      setTimeout(() => this.initializeMap(), 100);
    }
  }

  initializeMap(): void {
    if (!this.googleMapsLoaded) return;
    
    const mapElement = document.getElementById('booking-map');
    if (!mapElement) return;

    // Default location
    let lat = 28.6139; // New Delhi default
    let lng = 77.2090;

    const location = { lat, lng };

    this.map = new google.maps.Map(mapElement, {
      center: location,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      position: location,
      draggable: true
    });

    // Update address when marker is dragged
    this.marker.addListener('dragend', () => {
      if (this.marker) {
        const position = this.marker.getPosition();
        if (position) {
          this.reverseGeocode(position.lat(), position.lng());
        }
      }
    });

    // Allow clicking on map to set location
    this.map.addListener('click', (event: any) => {
      if (event.latLng) {
        this.updateMapLocation(event.latLng);
        this.reverseGeocode(event.latLng.lat(), event.latLng.lng());
      }
    });
  }

  updateMapLocation(location: any): void {
    if (this.map && this.marker) {
      this.map.setCenter(location);
      this.marker.setPosition(location);
    }
  }

  reverseGeocode(lat: number, lng: number): void {
    if (!this.googleMapsLoaded) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
      if (status === 'OK' && results && results[0]) {
        this.updateAddressFromPlace(results[0]);
      }
    });
  }
}
