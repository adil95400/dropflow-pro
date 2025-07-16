import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';
import 'package:dropflow_pro/src/models/supplier.dart';
import 'package:dropflow_pro/src/models/product.dart';
import 'package:dropflow_pro/src/providers/import_provider.dart';
import 'package:dropflow_pro/src/providers/suppliers_provider.dart';
import 'package:dropflow_pro/src/widgets/supplier_card.dart';
import 'package:dropflow_pro/src/widgets/loading_indicator.dart';
import 'package:dropflow_pro/src/widgets/error_view.dart';
import 'package:dropflow_pro/src/theme/app_colors.dart';

class ImportPage extends ConsumerStatefulWidget {
  const ImportPage({Key? key}) : super(key: key);

  @override
  ConsumerState<ImportPage> createState() => _ImportPageState();
}

class _ImportPageState extends ConsumerState<ImportPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _urlController = TextEditingController();
  final TextEditingController _bulkUrlsController = TextEditingController();
  String _selectedSupplier = 'aliexpress';
  String _selectedLanguage = 'fr';
  bool _autoOptimize = true;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    
    // Load suppliers when page initializes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(suppliersProvider.notifier).loadSuppliers();
    });
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    _urlController.dispose();
    _bulkUrlsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final importState = ref.watch(importProvider);
    final suppliersState = ref.watch(suppliersProvider);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Import Produits'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {
              // Navigate to import history
            },
          ),
        ],
      ),
      body: Column(
        children: [
          _buildSuppliersSection(suppliersState),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildTabBar(),
                  const SizedBox(height: 16),
                  Expanded(
                    child: TabBarView(
                      controller: _tabController,
                      children: [
                        _buildUrlTab(importState),
                        _buildFileTab(importState),
                        _buildBulkTab(importState),
                        _buildImageTab(importState),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuppliersSection(AsyncValue<List<Supplier>> suppliersState) {
    return Container(
      height: 120,
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: suppliersState.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Text('Erreur: ${error.toString()}'),
        ),
        data: (suppliers) => ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: suppliers.length,
          itemBuilder: (context, index) {
            final supplier = suppliers[index];
            return Padding(
              padding: const EdgeInsets.only(right: 12),
              child: SupplierCard(
                supplier: supplier,
                isSelected: _selectedSupplier == supplier.id,
                onTap: () {
                  setState(() {
                    _selectedSupplier = supplier.id;
                  });
                },
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildTabBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(8),
      ),
      child: TabBar(
        controller: _tabController,
        indicator: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        labelColor: AppColors.primary,
        unselectedLabelColor: Colors.grey[700],
        tabs: const [
          Tab(text: 'URL'),
          Tab(text: 'Fichier'),
          Tab(text: 'Bulk'),
          Tab(text: 'Image'),
        ],
      ),
    );
  }

  Widget _buildUrlTab(AsyncValue<ImportState> importState) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            controller: _urlController,
            decoration: InputDecoration(
              labelText: 'URL du Produit',
              hintText: 'https://aliexpress.com/item/...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              prefixIcon: const Icon(Icons.link),
            ),
          ),
          const SizedBox(height: 16),
          _buildLanguageSelector(),
          const SizedBox(height: 16),
          _buildOptimizationToggle(),
          const SizedBox(height: 24),
          _buildImportButton(
            importState,
            onPressed: () {
              if (_urlController.text.isNotEmpty) {
                ref.read(importProvider.notifier).importFromUrl(
                  _urlController.text,
                  _selectedSupplier,
                  _selectedLanguage,
                  _autoOptimize,
                );
              }
            },
          ),
          if (importState.isLoading) ...[
            const SizedBox(height: 16),
            const LinearProgressIndicator(),
            const SizedBox(height: 8),
            Text(
              importState.value?.message ?? 'Importation en cours...',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600]),
            ),
          ],
          if (importState.hasValue && importState.value!.product != null) ...[
            const SizedBox(height: 24),
            _buildImportedProductCard(importState.value!.product!),
          ],
        ],
      ),
    );
  }

  Widget _buildFileTab(AsyncValue<ImportState> importState) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(8),
              color: Colors.grey[50],
            ),
            child: Column(
              children: [
                Icon(
                  Icons.file_upload_outlined,
                  size: 48,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'Glissez-déposez votre fichier CSV/XML ou cliquez pour sélectionner',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey[600]),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () async {
                    // File picker logic
                  },
                  child: const Text('Choisir un fichier'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBulkTab(AsyncValue<ImportState> importState) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: TextField(
            controller: _bulkUrlsController,
            maxLines: null,
            expands: true,
            decoration: InputDecoration(
              labelText: 'URLs (une par ligne)',
              hintText: 'https://aliexpress.com/item/1\nhttps://aliexpress.com/item/2\n...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              alignLabelWithHint: true,
            ),
          ),
        ),
        const SizedBox(height: 16),
        _buildLanguageSelector(),
        const SizedBox(height: 16),
        _buildOptimizationToggle(),
        const SizedBox(height: 24),
        _buildImportButton(
          importState,
          onPressed: () {
            if (_bulkUrlsController.text.isNotEmpty) {
              final urls = _bulkUrlsController.text
                  .split('\n')
                  .where((url) => url.trim().isNotEmpty)
                  .toList();
              
              if (urls.isNotEmpty) {
                ref.read(importProvider.notifier).importBulk(
                  urls,
                  _selectedSupplier,
                  _selectedLanguage,
                  _autoOptimize,
                );
              }
            }
          },
        ),
      ],
    );
  }

  Widget _buildImageTab(AsyncValue<ImportState> importState) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(8),
              color: Colors.grey[50],
            ),
            child: Column(
              children: [
                Icon(
                  Icons.camera_alt_outlined,
                  size: 48,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'Prenez une photo du produit ou scannez un code-barres',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey[600]),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton.icon(
                      onPressed: () async {
                        final ImagePicker picker = ImagePicker();
                        final XFile? image = await picker.pickImage(
                          source: ImageSource.camera,
                          maxWidth: 1024,
                          maxHeight: 1024,
                        );
                        
                        if (image != null) {
                          ref.read(importProvider.notifier).importFromImage(image.path);
                        }
                      },
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Prendre une photo'),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      onPressed: () async {
                        String barcodeScanRes = await FlutterBarcodeScanner.scanBarcode(
                          '#FF6666',
                          'Annuler',
                          true,
                          ScanMode.BARCODE,
                        );
                        
                        if (barcodeScanRes != '-1') {
                          ref.read(importProvider.notifier).importFromBarcode(barcodeScanRes);
                        }
                      },
                      icon: const Icon(Icons.qr_code_scanner),
                      label: const Text('Scanner'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Langue Cible',
          style: TextStyle(
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _selectedLanguage,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          items: const [
            DropdownMenuItem(value: 'fr', child: Text('🇫🇷 Français')),
            DropdownMenuItem(value: 'en', child: Text('🇺🇸 Anglais')),
            DropdownMenuItem(value: 'es', child: Text('🇪🇸 Espagnol')),
            DropdownMenuItem(value: 'de', child: Text('🇩🇪 Allemand')),
            DropdownMenuItem(value: 'it', child: Text('🇮🇹 Italien')),
          ],
          onChanged: (value) {
            if (value != null) {
              setState(() {
                _selectedLanguage = value;
              });
            }
          },
        ),
      ],
    );
  }

  Widget _buildOptimizationToggle() {
    return Row(
      children: [
        Switch(
          value: _autoOptimize,
          activeColor: AppColors.primary,
          onChanged: (value) {
            setState(() {
              _autoOptimize = value;
            });
          },
        ),
        const SizedBox(width: 8),
        const Text(
          'Optimiser automatiquement avec IA',
          style: TextStyle(
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildImportButton(AsyncValue<ImportState> state, {required VoidCallback onPressed}) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: state.isLoading ? null : onPressed,
        icon: const Icon(Icons.bolt),
        label: Text(state.isLoading ? 'Importation en cours...' : 'Importer avec IA'),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }

  Widget _buildImportedProductCard(Product product) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (product.images.isNotEmpty)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      product.images.first,
                      width: 80,
                      height: 80,
                      fit: BoxFit.cover,
                    ),
                  ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.title,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Prix: ${product.price.toStringAsFixed(2)} €',
                        style: TextStyle(
                          color: Colors.green[700],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Fournisseur: ${product.supplier}',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      // View product details
                    },
                    child: const Text('Voir détails'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Edit product
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Modifier'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}