import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

// ==================== GET ====================
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        let query = supabase.from('user_accounts').select('*');
        
        if (userId) {
            // Get single user
            const { data, error } = await query.eq('user_id', userId).single();
            
            if (error && error.code === 'PGRST116') {
                return NextResponse.json({ 
                    success: false, 
                    message: 'User not found' 
                }, { status: 404 });
            }
            
            if (error) throw error;
            
            return NextResponse.json({ 
                success: true, 
                data: data
            });
        } else {
            // Get all users
            const { data: allUsers, error: allError } = await supabase
                .from('user_accounts')
                .select('*')
                .order('registered_at', { ascending: false });
            
            if (allError) throw allError;
            
            // ✅ Calculate stats manually
            const stats = {
                total_users: allUsers?.length || 0,
                active_users: allUsers?.filter(u => u.account_status === 'active').length || 0,
                total_balance: allUsers?.reduce((sum, u) => sum + (u.balance || 0), 0) || 0,
                avg_balance: allUsers?.length > 0 
                    ? (allUsers.reduce((sum, u) => sum + (u.balance || 0), 0) / allUsers.length) 
                    : 0
            };
            
            return NextResponse.json({
                users: allUsers || [],
                stats: stats,
                total: allUsers?.length || 0
            });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// ==================== POST (Create User) ====================
export async function POST(request) {
    try {
        const body = await request.json();
        const { 
            user_id,
            pin,
            balance = 0,
            account_status = 'active',
            last_login,
            remarks
        } = body;
        
        // Check if user already exists
        const { data: existing, error: checkError } = await supabase
            .from('user_accounts')
            .select('user_id')
            .eq('user_id', user_id)
            .single();
        
        if (existing) {
            return NextResponse.json(
                { error: 'User ID already exists' },
                { status: 400 }
            );
        }
        
        // Insert new user with PIN
        const { data, error } = await supabase
            .from('user_accounts')
            .insert([{
                user_id: user_id,
                pin: pin || null,
                balance: balance || 0,
                account_status: account_status || 'active',
                last_login: last_login || null,
                registered_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                remarks: remarks || null
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        return NextResponse.json({ 
            success: true, 
            message: 'User created successfully',
            data 
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

// ==================== PUT (Update User) ====================
export async function PUT(request) {
    try {
        const body = await request.json();
        const { 
            user_id,
            pin,
            balance,
            account_status,
            last_login,
            remarks
        } = body;
        
        if (!user_id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }
        
        // Build update object (only include fields that are provided)
        const updateData = {};
        if (pin !== undefined) updateData.pin = pin;
        if (balance !== undefined) updateData.balance = balance;
        if (account_status !== undefined) updateData.account_status = account_status;
        if (last_login !== undefined) updateData.last_login = last_login;
        if (remarks !== undefined) updateData.remarks = remarks;
        
        // Always update updated_at
        updateData.updated_at = new Date().toISOString();
        
        const { data, error } = await supabase
            .from('user_accounts')
            .update(updateData)
            .eq('user_id', user_id)
            .select()
            .single();
        
        if (error) throw error;
        
        return NextResponse.json({ 
            success: true, 
            message: 'User updated successfully',
            data 
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// ==================== DELETE ====================
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }
        
        const { error } = await supabase
            .from('user_accounts')
            .delete()
            .eq('user_id', userId);
        
        if (error) throw error;
        
        return NextResponse.json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}