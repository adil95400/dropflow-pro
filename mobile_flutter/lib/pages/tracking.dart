import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:dropflow_pro/src/models/tracking_order.dart';
import 'package:dropflow_pro/src/models/tracking_event.dart';
import 'package:dropflow_pro/src/providers/tracking_provider.dart';
import 'package:dropflow_pro/src/widgets/loading_indicator.dart';
import 'package:dropflow_pro/src/widgets/error_view.dart';
import 'package:dropflow_pro/src/theme/app_colors.dart';

class TrackingPage extends ConsumerStatefulWidget {
  const TrackingPage({Key? key}) : super(key: key);

  @override
  ConsumerState<TrackingPage> createState() => _TrackingPageState();
}

class _TrackingPageState extends ConsumerState<TrackingPage> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';
  String _selectedCarrier = 'all';
  String? _selectedTrackingNumber;

  @override
  void initState() {
    super.initState();
    // Load tracking data when page initializes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(trackingProvider.notifier).loadOrders();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final trackingState = ref.watch(trackingProvider);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tracking Commandes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.read(trackingProvider.notifier).refreshAllTracking();
            },
          ),
        ],
      ),
      body: trackingState.when(
        loading: () => const LoadingIndicator(),
        error: (error, stackTrace) => ErrorView(
          message: 'Erreur de chargement des commandes',
          onRetry: () => ref.read(trackingProvider.notifier).loadOrders(),
        ),
        data: (data) => _buildTrackingContent(data),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showAddTrackingDialog();
        },
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildTrackingContent(TrackingData data) {
    final filteredOrders = _filterOrders(data.orders);
    
    return Column(
      children: [
        _buildSearchAndFilters(),
        Expanded(
          child: Row(
            children: [
              // Orders list
              Expanded(
                flex: 1,
                child: _buildOrdersList(filteredOrders),
              ),
              
              // Tracking details
              Expanded(
                flex: 2,
                child: _selectedTrackingNumber != null
                    ? _buildTrackingDetails(data.getOrderByTracking(_selectedTrackingNumber!))
                    : _buildEmptyTrackingState(),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSearchAndFilters() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Search bar
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Rechercher commande, client, tracking...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
            ),
            onChanged: (_) {
              setState(() {});
            },
          ),
          const SizedBox(height: 12),
          
          // Filters
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildStatusFilter(),
                const SizedBox(width: 12),
                _buildCarrierFilter(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusFilter() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButton<String>(
        value: _selectedStatus,
        icon: const Icon(Icons.arrow_drop_down),
        underline: const SizedBox(),
        items: const [
          DropdownMenuItem(value: 'all', child: Text('Tous les statuts')),
          DropdownMenuItem(value: 'processing', child: Text('En préparation')),
          DropdownMenuItem(value: 'shipped', child: Text('Expédié')),
          DropdownMenuItem(value: 'in_transit', child: Text('En transit')),
          DropdownMenuItem(value: 'out_for_delivery', child: Text('En livraison')),
          DropdownMenuItem(value: 'delivered', child: Text('Livré')),
          DropdownMenuItem(value: 'exception', child: Text('Problème')),
        ],
        onChanged: (value) {
          if (value != null) {
            setState(() {
              _selectedStatus = value;
            });
          }
        },
      ),
    );
  }

  Widget _buildCarrierFilter() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButton<String>(
        value: _selectedCarrier,
        icon: const Icon(Icons.arrow_drop_down),
        underline: const SizedBox(),
        items: const [
          DropdownMenuItem(value: 'all', child: Text('Tous transporteurs')),
          DropdownMenuItem(
            value: 'Colissimo',
            child: Row(
              children: [
                Text('📦 '),
                Text('Colissimo'),
              ],
            ),
          ),
          DropdownMenuItem(
            value: 'Chronopost',
            child: Row(
              children: [
                Text('⚡ '),
                Text('Chronopost'),
              ],
            ),
          ),
          DropdownMenuItem(
            value: 'DHL',
            child: Row(
              children: [
                Text('🚚 '),
                Text('DHL'),
              ],
            ),
          ),
          DropdownMenuItem(
            value: 'UPS',
            child: Row(
              children: [
                Text('📮 '),
                Text('UPS'),
              ],
            ),
          ),
          DropdownMenuItem(
            value: 'FedEx',
            child: Row(
              children: [
                Text('✈️ '),
                Text('FedEx'),
              ],
            ),
          ),
        ],
        onChanged: (value) {
          if (value != null) {
            setState(() {
              _selectedCarrier = value;
            });
          }
        },
      ),
    );
  }

  Widget _buildOrdersList(List<TrackingOrder> orders) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.local_shipping_outlined,
              size: 48,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'Aucune commande trouvée',
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 16,
              ),
            ),
          ],
        ),
      );
    }
    
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        final isSelected = order.trackingNumber == _selectedTrackingNumber;
        
        return Card(
          elevation: isSelected ? 4 : 1,
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: isSelected
                ? BorderSide(color: AppColors.primary, width: 2)
                : BorderSide.none,
          ),
          child: InkWell(
            onTap: () {
              setState(() {
                _selectedTrackingNumber = order.trackingNumber;
              });
            },
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        order.orderNumber,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      _buildStatusBadge(order.status),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Client: ${order.customerName}',
                    style: const TextStyle(fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Produit: ${order.product}',
                    style: const TextStyle(fontSize: 14),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Montant: ${order.amount.toStringAsFixed(2)} €',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (order.trackingNumber != null) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Text(
                          'Tracking: ',
                          style: TextStyle(fontSize: 14),
                        ),
                        Text(
                          order.trackingNumber!,
                          style: const TextStyle(
                            fontSize: 14,
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                  if (order.carrier != null) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Text(
                          'Transporteur: ',
                          style: TextStyle(fontSize: 14),
                        ),
                        Text(
                          order.carrier!,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildTrackingDetails(TrackingOrder? order) {
    if (order == null) {
      return _buildEmptyTrackingState();
    }
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Tracking header
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Text(
                    order.trackingNumber ?? 'N/A',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      fontFamily: 'monospace',
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '${_getCarrierEmoji(order.carrier)} ',
                        style: const TextStyle(fontSize: 20),
                      ),
                      Text(
                        order.carrier ?? 'Transporteur inconnu',
                        style: const TextStyle(
                          fontWeight: FontWeight.w500,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  _buildStatusBadge(order.status),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Current status
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Position actuelle',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    order.currentLocation ?? 'Information non disponible',
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  if (order.estimatedDelivery != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      'Livraison estimée: ${DateFormat('dd/MM/yyyy').format(DateTime.parse(order.estimatedDelivery!))}',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Progress bar
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Expédié',
                        style: TextStyle(fontSize: 12),
                      ),
                      const Text(
                        'En transit',
                        style: TextStyle(fontSize: 12),
                      ),
                      const Text(
                        'Livré',
                        style: TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: _getProgressValue(order.status),
                      minHeight: 8,
                      backgroundColor: Colors.grey[200],
                      valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Tracking events
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Historique',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...order.events.map((event) => _buildEventItem(event, order.events.indexOf(event) == 0)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Actions
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    // Notify customer
                  },
                  icon: const Icon(Icons.email),
                  label: const Text('Notifier Client'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    if (order.trackingNumber != null) {
                      ref.read(trackingProvider.notifier).refreshTracking(order.trackingNumber!);
                    }
                  },
                  icon: const Icon(Icons.refresh),
                  label: const Text('Actualiser'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyTrackingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.local_shipping_outlined,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'Sélectionnez une commande pour voir les détails du suivi',
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 16,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildEventItem(TrackingEvent event, bool isFirst) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isFirst ? AppColors.primary : Colors.grey[300],
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  _getEventIcon(event.status),
                  size: 14,
                  color: isFirst ? Colors.white : Colors.grey[700],
                ),
              ),
              if (event != event) // If not the last event
                Container(
                  width: 2,
                  height: 30,
                  color: Colors.grey[300],
                ),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  event.description,
                  style: TextStyle(
                    fontWeight: isFirst ? FontWeight.bold : FontWeight.normal,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  event.location,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${event.date} à ${event.time}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color backgroundColor;
    Color textColor;
    String label;
    
    switch (status) {
      case 'processing':
        backgroundColor = Colors.yellow[100]!;
        textColor = Colors.yellow[800]!;
        label = 'En préparation';
        break;
      case 'shipped':
        backgroundColor = Colors.blue[100]!;
        textColor = Colors.blue[800]!;
        label = 'Expédié';
        break;
      case 'in_transit':
        backgroundColor = Colors.orange[100]!;
        textColor = Colors.orange[800]!;
        label = 'En transit';
        break;
      case 'out_for_delivery':
        backgroundColor = Colors.purple[100]!;
        textColor = Colors.purple[800]!;
        label = 'En livraison';
        break;
      case 'delivered':
        backgroundColor = Colors.green[100]!;
        textColor = Colors.green[800]!;
        label = 'Livré';
        break;
      case 'exception':
        backgroundColor = Colors.red[100]!;
        textColor = Colors.red[800]!;
        label = 'Problème';
        break;
      default:
        backgroundColor = Colors.grey[100]!;
        textColor = Colors.grey[800]!;
        label = 'Inconnu';
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: textColor,
          fontWeight: FontWeight.w500,
          fontSize: 12,
        ),
      ),
    );
  }

  void _showAddTrackingDialog() {
    final TextEditingController trackingController = TextEditingController();
    final TextEditingController orderController = TextEditingController();
    String selectedCarrier = 'Colissimo';
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Ajouter un tracking'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: orderController,
                decoration: const InputDecoration(
                  labelText: 'Numéro de commande',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: trackingController,
                decoration: const InputDecoration(
                  labelText: 'Numéro de tracking',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedCarrier,
                decoration: const InputDecoration(
                  labelText: 'Transporteur',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'Colissimo', child: Text('Colissimo')),
                  DropdownMenuItem(value: 'Chronopost', child: Text('Chronopost')),
                  DropdownMenuItem(value: 'DHL', child: Text('DHL')),
                  DropdownMenuItem(value: 'UPS', child: Text('UPS')),
                  DropdownMenuItem(value: 'FedEx', child: Text('FedEx')),
                ],
                onChanged: (value) {
                  if (value != null) {
                    selectedCarrier = value;
                  }
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              if (trackingController.text.isNotEmpty && orderController.text.isNotEmpty) {
                ref.read(trackingProvider.notifier).addTracking(
                  orderNumber: orderController.text,
                  trackingNumber: trackingController.text,
                  carrier: selectedCarrier,
                );
                Navigator.of(context).pop();
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
            ),
            child: const Text('Ajouter'),
          ),
        ],
      ),
    );
  }

  List<TrackingOrder> _filterOrders(List<TrackingOrder> orders) {
    return orders.where((order) {
      // Filter by search query
      final query = _searchController.text.toLowerCase();
      final matchesSearch = query.isEmpty ||
          order.orderNumber.toLowerCase().contains(query) ||
          order.customerName.toLowerCase().contains(query) ||
          order.trackingNumber?.toLowerCase().contains(query) == true;
      
      // Filter by status
      final matchesStatus = _selectedStatus == 'all' || order.status == _selectedStatus;
      
      // Filter by carrier
      final matchesCarrier = _selectedCarrier == 'all' || order.carrier == _selectedCarrier;
      
      return matchesSearch && matchesStatus && matchesCarrier;
    }).toList();
  }

  double _getProgressValue(String status) {
    switch (status) {
      case 'delivered':
        return 1.0;
      case 'out_for_delivery':
        return 0.8;
      case 'in_transit':
        return 0.5;
      case 'shipped':
        return 0.2;
      default:
        return 0.1;
    }
  }

  IconData _getEventIcon(String status) {
    switch (status) {
      case 'delivered':
        return Icons.check_circle;
      case 'out_for_delivery':
        return Icons.local_shipping;
      case 'in_transit':
        return Icons.flight;
      case 'shipped':
        return Icons.inventory_2;
      case 'exception':
        return Icons.error;
      default:
        return Icons.info;
    }
  }

  String _getCarrierEmoji(String? carrier) {
    if (carrier == null) return '📦';
    
    switch (carrier) {
      case 'Colissimo':
        return '📦';
      case 'Chronopost':
        return '⚡';
      case 'DHL':
        return '🚚';
      case 'UPS':
        return '📮';
      case 'FedEx':
        return '✈️';
      default:
        return '📦';
    }
  }
}